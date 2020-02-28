import { CardContent } from "@material-ui/core";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { withStyles, withTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

import strings from "../../localizeStrings";

const styles = theme => {
  return {
    subtitle: {
      color: theme.palette.grey.dark
    },
    caption: {
      color: theme.palette.grey.main
    }
  };
};

const Subproject = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <CardContent style={{ textAlign: "center" }}>
        <List>
          <img
            src="../images-for-empty-state/subproject-table-empty-state.png"
            alt={strings.common.no_subprojects}
            width="505vw"
          />
          <Typography variant="subtitle1" className={classes.subtitle}>
            {strings.common.no_subprojects}
          </Typography>
          <Typography variant="caption" className={classes.caption}>
            {strings.common.no_items_text}
          </Typography>
        </List>
      </CardContent>
    );
  })
);

const ProjectBudget = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <table style={{ alignItems: "center" }}>
        <tbody>
          <tr height="200vh">
            <td max-width="200vw">
              <img
                src="../images-for-empty-state/project-budget-empty-state.png"
                alt={strings.common.no_budget}
                width="150vw"
              />
            </td>
            <td>
              <Typography variant="subtitle1" className={classes.subtitle}>
                {strings.common.no_budget}
              </Typography>
              <Typography variant="caption" className={classes.caption}>
                {strings.common.no_budget_project}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    );
  })
);

const WorkflowItem = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <CardContent style={{ textAlign: "center" }}>
        <List>
          <img
            src="../../images-for-empty-state/workflow-items-empty-state.png"
            alt={strings.common.no_workflow_items}
            width="505vw"
          />
          <Typography variant="subtitle1" className={classes.subtitle}>
            {strings.common.no_workflow_items}
          </Typography>
          <Typography variant="caption" className={classes.caption}>
            {strings.common.no_items_text}
          </Typography>
        </List>
      </CardContent>
    );
  })
);

const SubprojectBudget = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <table style={{ alignItems: "center" }}>
        <tbody>
          <tr height="200vh">
            <td max-width="200vw">
              <img
                src="../../images-for-empty-state/project-budget-empty-state.png"
                alt={strings.common.no_budget}
                width="150vw"
              />
            </td>
            <td>
              <Typography variant="subtitle1" className={classes.subtitle}>
                {strings.common.no_budget}
              </Typography>
              <Typography variant="caption" className={classes.caption}>
                {strings.common.no_budget_subproject}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    );
  })
);

const Notification = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <div style={{ textAlign: "center" }}>
        <img
          src="images-for-empty-state/notification-empty-state.png"
          alt={strings.common.no_notifications}
          width="505vw"
        />
        <Typography variant="body1" className={classes.caption}>
          {strings.common.no_notifications}
        </Typography>
      </div>
    );
  })
);

const Users = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <Paper style={{ textAlign: "center" }}>
        <img src="images-for-empty-state/users-table-empty-state.png" alt={strings.common.no_users} width="505vw" />
        <Typography variant="subtitle1" className={classes.subtitle}>
          {strings.common.no_users}
        </Typography>
        <Typography variant="caption" className={classes.caption}>
          {strings.common.no_users_text}
        </Typography>
        <br />
      </Paper>
    );
  })
);

const UserGroups = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <Paper style={{ textAlign: "center" }}>
        <img
          src="images-for-empty-state/users-group-table-empty-state.png"
          alt={strings.common.no_groups}
          width="597vw"
        />
        <Typography variant="subtitle1" className={classes.subtitle}>
          {strings.common.no_groups}
        </Typography>
        <Typography variant="caption" className={classes.caption}>
          {strings.common.no_groups_text}
        </Typography>
        <br />
      </Paper>
    );
  })
);

const NewOrganizations = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <table style={{ alignItems: "center" }}>
        <tbody>
          <tr>
            <td width="200vw">
              <img
                src="images-for-empty-state/organization-empty-state.png"
                alt={strings.common.no_organizations}
                width="150vw"
              />
            </td>
            <td>
              <Typography variant="body2" className={classes.caption}>
                {strings.common.no_organizations}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    );
  })
);

const ExistingNodes = withTheme()(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <table style={{ alignItems: "center" }}>
        <tbody>
          <tr>
            <td width="200vw">
              <img
                src="images-for-empty-state/nodes-for-orga-empty-state.png"
                alt={strings.common.no_nodes}
                width="150vw"
              />
            </td>
            <td>
              <Typography variant="body2" className={classes.caption}>
                {strings.common.no_nodes}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    );
  })
);

export {
  Subproject,
  ProjectBudget,
  WorkflowItem,
  SubprojectBudget,
  Notification,
  Users,
  UserGroups,
  NewOrganizations,
  ExistingNodes
};
