import React, { Component } from "react";
import Like from "./common/like";
import tasks from "../service/tasks.json";

class TaskManager extends Component {
  state = {
    tasks: tasks,
  };
  handleView = (taskId) => {
    const tasks = this.state.tasks.filter((task) => task.id !== taskId);
    this.setState({ tasks });
  };
  handleEdit = (taskId) => {
    const tasks = this.state.tasks.filter((task) => task.id !== taskId);
    this.setState({ tasks });
  };
  handleDelete = (taskId) => {
    const tasks = this.state.tasks.filter((task) => task.id !== taskId);
    this.setState({ tasks });
  };
  handleChangeChk = (taskId) => {
    alert(taskId);
  };
  loadCreateForm = () => {
    const currentTasks = [...this.state.tasks];
    currentTasks.push({
      id: 99,
      name: "Another Task",
      isCompleted: false,
    });
    this.setState({
      tasks: currentTasks
    });
  };

  render(props) {
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Task Title</th>
              <th scope="col">Is Completed</th>
              <th scope="col">Like?</th>
              <th scope="col" colSpan="3">
                <button
                  onClick={() => this.loadCreateForm()}
                  className="btn btn-success"
                >
                  Create New
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.tasks.map((task) => (
              <tr>
                <th scope="row">{task.id}</th>
                <td>{task.name}</td>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={task.isCompleted}
                    onChange={() => this.handleChangeChk(task.id)}
                  />
                </td>
                <td>
                  <Like liked="true" />
                </td>
                <td>
                  <button
                    onClick={() => this.handleView(task.id)}
                    className="btn btn-info"
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => this.handleEdit(task.id)}
                    className="btn btn-warning"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => this.handleDelete(task.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TaskManager;
