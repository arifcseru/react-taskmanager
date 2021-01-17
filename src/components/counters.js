import React, { Component } from "react";
import Counter from "./counter";
class Counters extends Component {
  render() {
    const {onReset, onDelete, onIncrement, onDecrement} = this.props;
    return (
      <div>
        <button
          className="btn btn-secondary btn-sm m-2"
          onClick={onReset}
        >
          Reset
        </button>
        {this.props.counters.map((counter) => (
          <Counter
            className="col-md-6"
            key={counter.id}
            id={counter.id}
            onDelete={onDelete}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            value={counter.value}
            counter={counter}
          />
        ))}
      </div>
    );
  }
}

export default Counters;
