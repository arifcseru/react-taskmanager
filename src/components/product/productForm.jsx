import React, { Component } from "react";

class ProductForm extends Component {
  state = {};
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
                  aria-describedby="emailHelp"
                />
                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
              </div>
              <div className="mb-3">
                <label for="description" className="form-label">
                  Product Description
                </label>
                <input type="text" className="form-control" id="description" />
              </div>
              <div className="mb-3 form-check">
                <label className="form-check-label" for="price">
                  Price
                </label>
                <input type="text" className="form-control" id="price" />
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

export default ProductForm;
