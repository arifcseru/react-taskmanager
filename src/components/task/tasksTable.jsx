import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Table from "../common/table";

class TasksTable extends Component {
  columns = [
    { path: "id", label: "Id" },
    {
      path: "title",
      label: "Title",
      content: (item) => (
        <NavLink to={"tasks/" + item.id}>{item.title}</NavLink>
      ),
    },
    {
      key: "isCompleted",
      label: "Is Completed",
      content: (item) => (
        <input
          type="checkbox"
          defaultChecked={item.completed}
          onChange={() => this.props.onLikeClick(item)}
        />
      ),
    },
    {
      key: "delete",
      label: "Delete",
      content: (item) => (
        <button
          onClick={() => this.props.onDelete(item.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      ),
    },
  ];
  render() {
    const { onCreate, data, onSort, sortColumn } = this.props;
    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          sortColumn={sortColumn}
          onCreate={onCreate}
          onSort={onSort}
          data={data}
        />
      </React.Fragment>
    );
  }
}

export default TasksTable;
