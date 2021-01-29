import React, { Component } from "react";
import Counters from "./components/counters";

import NavBar from "./components/NavBar";
import TaskManager from "./components/task/taskManager";
import NotFound from "./components/common/notFound";

import ProductManager from "./components/product/productManager";
import ProductDetails from "./components/product/productDetails";
import TaskDetails from "./components/task/taskDetails";
import ProductForm from "./components/product/productForm";
import TaskForm from "./components/task/taskForm";
import "bootstrap/dist/css/bootstrap.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";

class AppRoute extends Component {
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
              <Route path="/products" exact component={ProductManager}></Route>
              <Route path="/products/new" exact component={ProductForm}></Route>
              <Route path="/tasks/new" exact component={TaskForm}></Route>
              <Route path="/tasks/:id" exact component={TaskDetails}></Route>
              <Route path="/products/:id" exact component={ProductDetails}></Route>
              <Route path="/counters" exact render={props => <CounterManager counters={this.state.counters} {...props}/>} ></Route>
              <Route path="/taskManager" exact component={TaskManager}></Route>
              <Route path="/not-found" exact component={NotFound}></Route>
              <Route path="/login" exact component={Login}></Route>
              <Route path="/registration" exact component={Register}></Route>
              <Redirect to="/not-found"></Redirect>
            </Switch>
          </main>
        </Router>
      </React.Fragment>
    );
  }
}
class Welcome extends Component {
  state = {};
  render() {
    return <div> Welcome to Apps</div>;
  }
}

class CounterManager extends Component {
  state = {
    counters: [],
  };
  componentDidMount() {
    this.setState(this.props);
  }
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
export default AppRoute;
