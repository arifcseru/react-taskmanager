import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/">
            <a className="navbar-brand">Practice React</a>
          </Link>
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
              <Link to="/counters">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page">
                    Counters Management{" "}
                    <span className="badge badge-pill badge-secondary">
                      {this.props.totalCounters}
                    </span>
                  </a>
                </li>
              </Link>

              <Link to="/taskManager">
                <li className="nav-item">
                  <a className="nav-link">
                    Task Manager
                  </a>
                </li>
              </Link>
              <li className="nav-item">
                <a
                  className="nav-link disabled"
                  tabindex="-1"
                  aria-disabled="true"
                >
                  Admin Panel
                </a>
              </li>
            </ul>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 pull-right">
              <Link to="/logout">
                <li className="nav-item">
                  <a className="nav-link">
                    Logout
                  </a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
