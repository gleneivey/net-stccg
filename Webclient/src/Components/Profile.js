import React, { Component } from "react";
import PropTypes from "prop-types"
import "./Profile.css";

class Profile extends Component {
  static propTypes = {
    displayName: PropTypes.string.isRequired,
    doSignOut: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="profile">
        <div className="profile__name">{this.props.displayName}</div>
        <div className="profile__signout"><a onClick={this.doSignOut_}>
          Sign Out
        </a></div>
      </div>
    );
  }

  doSignOut_ = () => {
    this.props.doSignOut();
  };
}

export default Profile;

