import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Table from "../common/table";
class ProductsTable extends Component {
  columns = [
    { path: "id", label: "Id" },
    {
      path: "name",
      label: "Name",
      content: (item) => <NavLink to={"products/"+item.id}>{item.name}</NavLink>,
    },
    { path: "description", label: "Description" },
    { path: "category", label: "Category" },
    {
      key: "like",
      label: "Liked",
      content: (item) => (
        <input
          type="checkbox"
          defaultChecked={item.liked}
          onChange={() => this.props.onLikeClick(item)}
        />
      ),
    },
    {
      key: "delete",
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

export default ProductsTable;
