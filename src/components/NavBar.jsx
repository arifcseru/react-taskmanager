import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink to="/">
            <a className="navbar-brand">Practice React</a>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <NavLink to="/counters">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page">
                    Counters Management{" "}
                    <span className="badge badge-pill badge-secondary">
                      {this.props.totalCounters}
                    </span>
                  </a>
                </li>
              </NavLink>

              <NavLink to="/products">
                <li className="nav-item">
                  <a className="nav-link">
                    Products
                  </a>
                </li>
              </NavLink>
              <NavLink to="/taskManager">
                <li className="nav-item">
                  <a className="nav-link">
                    Task Manager
                  </a>
                </li>
              </NavLink>
            </ul>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 pull-right">
              <NavLink to="/login">
                <li className="nav-item">
                  <a className="nav-link">
                    Login
                  </a>
                </li>
              </NavLink>
            </ul>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 pull-right">
              <NavLink to="/logout">
                <li className="nav-item">
                  <a className="nav-link">
                    Logout
                  </a>
                </li>
              </NavLink>
            </ul>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 pull-right">
              <NavLink to="/registration">
                <li className="nav-item">
                  <a className="nav-link">
                    Registration
                  </a>
                </li>
              </NavLink>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
