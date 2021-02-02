import React, { Component } from "react";
import Form from "../common/Form";
import { save } from "./taskService";
import Joi from "joi-browser";

class TaskForm extends Form {
  state = {
    data: { taskTitle: "",  status: ""},
    errors: {},
  };

  schema = {
    taskTitle: Joi.string().required().label("Title"),
    status: Joi.string().required().label("Status"),
  };

  doSubmit = async () => {
    await save(this.state.data);
    this.props.history.push("/taskManager");
    console.log("Submitted.");
  };
 
  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-md-8"></div>
            <div className="col-md-4">
              {/* form>(div.form-group>label+input.form-control)*2 */}
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("taskTitle", "Title")}
                {this.renderInput("status", "Status")}
                {/* {this.renderInput("dueDate", "Due Date")} */}

                <div className="form-group">{this.renderButton("Save")}</div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TaskForm;
