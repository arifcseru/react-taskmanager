import React, { Component } from "react";

import tasks from "./tasks.json";
class TaskDetails extends Component {
  state = {
    task: {
      id: this.props.match.params.id,
    },
  };
  componentDidMount() {
    const id = this.props.match.params.id;

    const filteredTask = tasks.filter(function (taskObj) {
      return taskObj.id === parseInt(id);
    });
    const task = filteredTask.length > 0 ? filteredTask[0] : {
        id:0,
        name:""
    };
    this.setState({ task });
  }
  handleSubmit = () => {
    this.props.history.push("/taskManager");
  };
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-3">
            <form onSubmit={this.handleSubmit}>
              <div className="mb-3">
                <label for="name" className="form-label">
                  Task Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={this.state.task.name}
                  aria-describedby="emailHelp"
                />
                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          <div className="col-md-6"></div>
        </div>
      </React.Fragment>
    );
  }
}

export default TaskDetails;
