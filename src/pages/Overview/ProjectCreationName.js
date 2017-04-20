import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

class ProjectCreationName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Property Value',
    };
  }

  handleChange = (event) => {
    this.props.storeProjectName(event.target.value);
  };

  render() {
    var floatingLabelText="Project title"
    var hintText="Name of the project"
    if (this.props.type==='subproject'){
      floatingLabelText="Sub-Project title"
      hintText="Name of the sub-project"
    }else if (this.props.type==='workflow'){
      floatingLabelText="Workflow title"
      hintText="Name of the workflow"
    }
    return (
      <div style={{
        width: '40%',
        left: '20%',
        position: 'relative'
      }}>
        <TextField
          floatingLabelText={floatingLabelText}
          hintText={hintText}
          value={this.props.projectName}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ProjectCreationName;
