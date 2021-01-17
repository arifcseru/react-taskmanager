import React, { Component } from "react";
import Counters from "./components/counters";
import NavBar from "./components/NavBar";
import TaskManager from "./components/taskManager";
import "bootstrap/dist/css/bootstrap.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

class App extends Component {
  state = {
    counters: [
      { id: 1, value: 6 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 },
      { id: 5, value: 0 },
      { id: 6, value: 0 },
      { id: 7, value: 0 },
    ],
  };

  render() {
    return (
      <React.Fragment>
        <Router>
          <NavBar
            totalCounters={
              this.state.counters.filter((c) => c.value > 0).length
            }
          />
          <main className="container">
            <Switch>
              <Route path="/" exact component={Welcome}></Route>
              <Route path="/counters" exact component={CounterManager}></Route>
              <Route path="/taskManager" exact component={TaskManager}></Route>
            </Switch>
          </main>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;

class Welcome extends Component {
  state = {};
  render() {
    return <div> Welcome to Apps</div>;
  }
}

class CounterManager extends Component {
  state = {
    counters: [
      { id: 1, value: 6 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 },
      { id: 5, value: 0 },
      { id: 6, value: 0 },
      { id: 7, value: 0 },
    ],
  };

  handleDelete = (counterId) => {
    const counters = this.state.counters.filter((c) => c.id !== counterId);
    this.setState({ counters });
  };
  handleReset = () => {
    const counters = this.state.counters.map((c) => {
      c.value = 0;
      return c;
    });
    this.setState({ counters });
  };
  handleIncrement = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter };
    counters[index].value++;
    this.setState({ counters });
  };
  handleDecrement = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter };
    counters[index].value--;
    this.setState({ counters });
  };
  render() {
    return (
      <div>
        {" "}
        <Counters
          counters={this.state.counters}
          onIncrement={this.handleIncrement}
          onDecrement={this.handleDecrement}
          onDelete={this.handleDelete}
          onReset={this.handleReset}
        />
      </div>
    );
  }
}

class VidlyManager extends Component {
  state = {};
  render() {
    return <div> Welcome to Vidly Manager</div>;
  }
}
