import React, { Component } from "react";
import Form from "./common/Form";
import Joi from "joi-browser";

class Register extends Form {
  state = {
    data: { username: "", password: "" , name: ""},
    errors: {},
  };

  schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().label("Name"),
  };

  doSubmit = () => {
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
                {this.renderInput("username", "Username")}
                {this.renderInput("password", "Password", "password")}
                {this.renderInput("name", "Name")}

                <div className="form-group">{this.renderButton("Register")}</div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
