import React, { Component } from "react";
import Pagination from "../common/pagination";
import { paginate } from "../common/paginate";
import ListGroup from "../common/listGroup";

import products from "./products.json";
import ProductsTable from "./productsTable";
import _ from "lodash";

class ProductManager extends Component {
  state = {
    categories: ["All Categories", "Fruit", "Flower", "Garments", "Stationary"],
    currentPage: 1,
    products: products,
    pageSize: 5,
    count: products.length,
    currentItem: "Fruit",
    sortColumn: { path: "name", order: "asc" },
  };

  handleDelete = (id) => {
    const products = this.state.products.filter((product) => product.id !== id);
    this.setState({ products });
  };
  loadCreateForm = () => {
    this.props.history.push("/products/new");
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
    let productsClone = [...this.state.products];
    const filtered = productsClone.filter((product) => product.id === item.id);
    const index = productsClone.indexOf(item);
    filtered[0].liked = !filtered[0].liked;
    productsClone[index] = filtered[0];
    this.setState({
      products: productsClone,
    });
  };
  handleSort = (sortColumn) => {    
    this.setState({sortColumn});
  };
  render() {
    const {
      columns,
      pageSize,
      currentPage,
      currentItem,
      products,
      sortColumn,
    } = this.state;
    const filtered =
      currentItem && currentItem !== "All Categories"
        ? products.filter((product) => product.category === currentItem)
        : products;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const paginatedProducts = paginate(sorted, currentPage, pageSize);

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
              <ProductsTable
                sortColumn={sortColumn}
                onSort={this.handleSort}
                onLikeClick={this.handleChangeChk}
                data={paginatedProducts}
                onDelete={this.handleDelete}
                onCreate={this.loadCreateForm}
              />
              <Pagination
                currentPage={currentPage}
                itemsCount={filtered.length}
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

export default ProductManager;
