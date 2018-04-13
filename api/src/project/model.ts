import { AllowedUserGroupsByIntent, UserId } from "../authz/types";
import { MultichainClient, Stream, StreamTxId, StreamBody } from "../multichain";
import { findBadKeysInObject, isNonemptyString } from "../lib";
import { LogEntry } from "../multichain/Client.h";
import { Project, ProjectStreamMetadata, ProjectResponse } from "./model.h";
import Intent from "../authz/intents";
import { getAllowedIntents, authorized } from "../authz/index";
import { AuthToken } from "../authz/token";
import { mergePermissions } from "../global/model";

interface ProjectStream {
  stream: Stream;
  metadata: ProjectStreamMetadata;
  logs: LogEntry[];
  permissions: AllowedUserGroupsByIntent;
}

const isProject = (stream: Stream): boolean => stream.details.kind === "project";

const toProjectStream = (multichain: MultichainClient) => async (
  stream: Stream
): Promise<ProjectStream> => {
  const metadata = await multichain.latestValuesForKey(stream.name, "_metadata");
  const logs = await multichain.latestValuesForKey(stream.name, "_log", 1000);
  const permissions = await multichain.latestValuesForKey(stream.name, "_permissions");
  return {
    stream,
    metadata: metadata[0],
    logs,
    permissions: permissions[0]
  };
};

const toProject = async (futureProjectStream: Promise<ProjectStream>): Promise<Project> => {
  const projectStream = await futureProjectStream;
  return {
    id: projectStream.stream.name,
    ...projectStream.metadata,
    permissions: projectStream.permissions,
    logs: projectStream.logs
  };
};

const replacePermissionsWithAllowedIntents = async (
  token: AuthToken,
  project: Project
): Promise<ProjectResponse> => {
  const permissions = project.permissions;
  delete project.permissions;
  return {
    ...(project as any),
    allowedIntents: await getAllowedIntents(token, permissions || [])
  };
};

const isNotNull = x => x !== null;

export class ProjectModel {
  multichain: MultichainClient;

  constructor(multichain: MultichainClient) {
    this.multichain = multichain;
  }

  async list(token: AuthToken, authorized): Promise<ProjectResponse[]> {
    const streams: Stream[] = await this.multichain.streams();

    const projects = (await Promise.all(
      streams
        .filter(isProject)
        .map(toProjectStream(this.multichain))
        .map(toProject)
        .map(promise => promise.catch(err => null))
    )).filter(isNotNull) as Project[];

    const clearedProjects = (await Promise.all(
      projects.map(p =>
        authorized(p.permissions)
          .then(() => p)
          .catch(err => null)
      )
    )).filter(isNotNull) as Project[];

    // Instead of passing the permissions as is, we return the intents the current user
    // is allowed to execute:
    return Promise.all(
      clearedProjects.map(
        async project => await replacePermissionsWithAllowedIntents(token, project)
      )
    );
  }

  async details(token: AuthToken, projectId, authorized): Promise<ProjectResponse> {
    const fakeStream = { name: projectId } as Stream;
    const project = await toProject(toProjectStream(this.multichain)(fakeStream));
    await authorized(project.permissions);
    // Instead of passing the permissions as is, we return the intents the current user
    // is allowed to execute:
    return replacePermissionsWithAllowedIntents(token, project);
  }

  async grantPermissions(data, authorized) {
    const { id, permissions } = data;
    const permissionsKey = "_permissions";
    const permissionItem = await this.multichain.latestValuesForKey(id, "_permissions");
    const existingPermissions = permissionItem[0];
    await authorized(existingPermissions);
    const mergedPermissions = mergePermissions(permissions, existingPermissions);
    await this.multichain.updateStreamItem(id, permissionsKey, mergedPermissions);
  }

  async listPermissions(id, authorized) {
    const permissionsKey = "_permissions";
    const permissionItem = await this.multichain.latestValuesForKey(id, "_permissions");
    const existingPermissions = permissionItem[0];
    await authorized(existingPermissions);
    return { items: permissionItem };
  }

  async createProject(token: AuthToken, body, authorized): Promise<string> {
    const expectedKeys = ["displayName", "amount", "currency"];
    // TODO sanitize input
    const badKeys = findBadKeysInObject(expectedKeys, isNonemptyString, body);
    if (badKeys.length > 0) throw { kind: "ParseError", badKeys };

    /* TODO root permissions */
    const rootPermissions = new Map<string, string[]>();
    await authorized(rootPermissions); // throws if unauthorized

    const issuer = "alice";
    const txid: StreamTxId = await this.multichain.getOrCreateStream({
      kind: "project",
      metadata: {
        displayName: body.displayName,
        creationUnixTs: new Date().getTime().toString(),
        amount: body.amount,
        currency: body.currency,
        status: "open",
        ...(body.description ? { description: body.description } : {}),
        ...(body.thumbnail ? { thumbnail: body.thumbnail } : {})
      },
      initialLogEntry: { issuer, action: "created_project" },
      permissions: getDefaultPermissions(token)
    });

    console.log(`${issuer} has created a new project (txid=${txid})`);
    return txid;
  }
}

const getDefaultPermissions = (token: AuthToken): AllowedUserGroupsByIntent => {
  const defaultIntents: Object = {
    "project.viewSummary": [token.userId],
    "project.viewDetails": [token.userId],
    "project.assign": [token.userId],
    "project.intent.list": [token.userId],
    "project.intent.grantPermission": [token.userId],
    "project.intent.revokePermission": [token.userId]
  };
  return defaultIntents;
};
