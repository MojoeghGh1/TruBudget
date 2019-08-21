import { VError } from "verror";

import Intent from "./authz/intents";
import { Ctx } from "./lib/ctx";
import logger from "./lib/logger";

interface ErrorBody {
  apiVersion: "1.0";
  error: {
    intent: Intent;
    reason: UserVisibleError;
  };
}

interface InvalidFields {
  type: "INVALID_FIELDS";
  fields: [
    {
      name: string;
      errorType: string;
    }
  ];
}

interface NotAuthorized {
  type: "NOT_AUTHORIZED";
}

export function toHttpError(ctx: Ctx, error: any | any[]): { code: number; body: ErrorBody } {
  const errors = error instanceof Array ? error : [error];
  const httpErrors = errors.map(convertError);
  const httpError = httpErrors.reduce((acc, err) => ({
    code: Math.max(acc.code, err.code),
    message: acc.message === "" ? err.message : `${acc.message}, ${err.message}`,
  }));
  return { code: httpError.code, body: toErrorBody(httpError) };
}

function convertError(error: any): { code: number; message: string } {
  if (error instanceof Error) {
    logger.trace({ error }, error.message);
    return handleError(error);
  } else {
    logger.fatal({ error }, "BUG: Caught a non-Error type");
    console.trace();
    return { code: 500, message: "Sorry, something went wrong :(" };
  }
}

function handleError(error: Error): { code: number; message: string } {
  // We select the outer-most error that makes sense to turn into a status code:
  const name = selectHighLevelCause(error);

  switch (name) {
    case "BadRequest":
    case "AuthenticationFailed":
      return { code: 400, message: error.message };

    case "NotAuthorized":
      return { code: 403, message: error.message };

    case "PreconditionError":
      return { code: 409, message: error.message };

    case "ProjectCreationFailed":
      return { code: 400, message: error.message };

    default:
      return { code: 500, message: error.message };
  }
}

function selectHighLevelCause(error: Error): string {
  if (error.name !== "Error" && error.name !== "VError") {
    return error.name;
  }
  const cause = VError.cause(error);
  if (cause === null) {
    return error.name;
  } else {
    return selectHighLevelCause(cause);
  }
}

function toErrorBody({ code, message }): ErrorBody {
  return {
    apiVersion: "1.0",
    error: {
      code,
      message,
    },
  };
}
