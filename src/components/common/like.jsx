import React, { Component } from "react";

// INput: liked: boolean
// Output: onClick

class Like extends Component {
  render() {
    return (
        <i class="fa fa-heart-o" area-hidden="true">{this.props.liked}</i>
    );
  }
}

export default Like;
