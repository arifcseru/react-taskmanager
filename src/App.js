import React, { Component } from "react";
import AppRoute from "./AppRouter";
class App extends Component {

  render() {
    return (
      <React.Fragment>
        <AppRoute/>
      </React.Fragment>
    );
  }
}

export default App;
