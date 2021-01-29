import React, { Component } from "react";

import products from "./products.json";
class ProductDetails extends Component {
  state = {
    product: {
      id: this.props.match.params.id,
    },
  };
  componentDidMount() {
    const id = this.props.match.params.id;

    const filteredProduct = products.filter(function (productObj) {
      return productObj.id === parseInt(id);
    });
    const product = filteredProduct.length > 0 ? filteredProduct[0] : {
        id:0,
        name:"",
        description:"",
        price:0,
        category:""
    };
    this.setState({ product });
  }
  handleSubmit = () => {
    this.props.history.push("/products");
  };
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-3">
            <form onSubmit={this.handleSubmit}>
              <div className="mb-3">
                <label for="name" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={this.state.product.name}
                  aria-describedby="emailHelp"
                />
                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
              </div>
              <div className="mb-3">
                <label for="description" className="form-label">
                  Product Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.product.description}
                  id="description"
                />
              </div>
              <div className="mb-3 form-check">
                <label className="form-check-label" for="price">
                  Price
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.product.price}
                  id="price"
                />
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

export default ProductDetails;
