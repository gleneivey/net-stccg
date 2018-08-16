import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Profile.css';
import firebase from "./firebase";

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
    firebase.auth()
      .signOut()
      .then(() => {
        this.props.doSignOut();
      });
  };
}

export default Profile;

