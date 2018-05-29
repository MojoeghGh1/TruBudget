import React, { Component } from "react";

import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, InputLabel, Input, ListItemText, Typography } from "@material-ui/core";
import strings from "../../localizeStrings";
const styles = {
  formControl: {
    width: "100%"
  },
  checkbox: {
    height: "10px"
  }
};

class AssigneeSelection extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: ""
    };
  }

  renderUsers(users, assigneeId, disabled) {
    return users.map(u => {
      const { id, displayName } = u;
      return (
        <MenuItem key={id} value={id} onClick={() => (id !== assigneeId ? this.props.assign(id) : undefined)}>
          <Checkbox style={styles.checkbox} disabled={disabled} checked={id === assigneeId} />
          <ListItemText primary={displayName} />
        </MenuItem>
      );
    });
  }

  renderTitle(assignee) {
    if (!assignee) {
      return ["..."];
    }
    return [assignee.displayName];
  }

  render() {
    const { assigneeId, users, disabled, classes } = this.props;

    const selection = this.renderUsers(
      users.filter(u => u.displayName.toLowerCase().includes(this.state.searchTerm.toLowerCase())),
      assigneeId,
      disabled
    );
    const assignee = users.find(user => user.id === assigneeId);

    return (
      <FormControl disabled={disabled} className={classes.formControl}>
        <Select
          classes={{ selectMenu: classes.selectMenu }}
          value={this.renderTitle(assignee)}
          renderValue={s => (
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              <Checkbox style={styles.checkbox} checked={true} />
              <Typography variant="body1">{s} </Typography>
            </div>
          )}
          multiple
          onClose={() => this.setState({ searchTerm: "" })}
        >
          <div className="noFocus" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FormControl>
              <InputLabel>{strings.common.search}</InputLabel>
              <Input value={this.state.searchTerm} onChange={e => this.setState({ searchTerm: e.target.value })} />
            </FormControl>
          </div>
          <div>{selection}</div>
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(AssigneeSelection);
