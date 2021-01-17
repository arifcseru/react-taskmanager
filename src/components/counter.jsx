import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class Counter extends Component {
  constructor() {
    super();
    console.log("Counter Constructed!");
  }
  componentDidMount() {
    console.log("Counter Mounted!");
  }
  componentWillUnmount() {
    console.log("Counter Will Un Mounted!");
    console.log("Counter to be deleted: " + this.props.counter.id);
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.counter.value !== this.props.counter.value) {
      console.log("call ajax call to counter: " + this.props.counter.value);
    }
  }

  render() {
    return (
      <div>
        <div className="badge badge-primary">{this.props.counter.value}</div>
        <button
          onClick={() => this.props.onIncrement(this.props.counter)}
          className="btn btn-secondary btn-sm m-2"
        >
          +
        </button>
        <button
          onClick={() => this.props.onDecrement(this.props.counter)}
          className="btn btn-secondary btn-sm m-2"
        >
          -
        </button>
        <button
          className="btn btn-info"
          onClick={() => this.props.onDelete(this.props.counter.id)}
          className="btn btn-secondary btn-sm m-2"
        >
          Delete
        </button>
      </div>
    );
  }
}

export default Counter;
