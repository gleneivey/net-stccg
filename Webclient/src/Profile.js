import React, { Component } from 'react';
import './Profile.css';
import firebase from "./firebase";

class Profile extends Component {
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

