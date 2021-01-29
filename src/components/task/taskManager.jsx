import React, { Component } from "react";
import Pagination from "../common/pagination";
import { paginate } from "../common/paginate";
import { getAll, getAll as tasks } from "./taskService";
import ListGroup from "../common/listGroup";

// import tasks from "./tasks.json";
import TasksTable from "./tasksTable";
import _ from "lodash";

class taskManager extends Component {
  state = {
    categories: ["All Tasks", "React JS", "Java", "Spring Boot", "Refactoring"],
    currentPage: 1,
    tasks: tasks,
    pageSize: 10,
    count: tasks.length,
    currentItem: "All Tasks",
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data: tasks } = await getAll();
    this.setState({ tasks });
  }

  handleDelete = (id) => {
    const tasks = this.state.tasks.filter((task) => task.id !== id);
    this.setState({ tasks });
  };
  loadCreateForm = () => {
    this.props.history.push("/tasks/new");
  };
  handlePageChange = (page) => {
    this.setState({
      currentPage: page,
    });
  };
  handleCategorySelect = (item) => {
    this.setState({
      currentItem: item,
      currentPage: 1,
    });
  };

  handleChangeChk = (item) => {
    let tasksClone = [...this.state.tasks];
    const filtered = tasksClone.filter((task) => task.id === item.id);
    const index = tasksClone.indexOf(item);
    filtered[0].liked = !filtered[0].liked;
    tasksClone[index] = filtered[0];
    this.setState({
      tasks: tasksClone,
    });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  getPagedData = () => {
    const {
      columns,
      pageSize,
      currentPage,
      currentItem,
      tasks,
      sortColumn,
    } = this.state;
    const filtered =
      currentItem && currentItem !== "All Tasks"
        ? tasks.filter((task) => task.taskType === currentItem)
        : tasks;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const paginatedtasks = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: paginatedtasks };
  };
  render() {
    const { columns, pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data } = this.getPagedData();
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <ListGroup
                currentItem={this.state.currentItem}
                textProperty="name"
                valueProperty="_id"
                items={this.state.categories}
                onItemSelect={this.handleCategorySelect}
              />
            </div>
            <div className="col-md-10">
              <TasksTable
                columns={columns}
                sortColumn={sortColumn}
                onSort={this.handleSort}
                onLikeClick={this.handleChangeChk}
                data={data}
                onDelete={this.handleDelete}
                onCreate={this.loadCreateForm}
              />
              <Pagination
                currentPage={currentPage}
                itemsCount={totalCount}
                pageSize={pageSize}
                onPageChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default taskManager;
