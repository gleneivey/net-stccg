import React, { Component } from 'react';
import GoogleButton from 'react-google-button'
import './SignIn.css';
import firebase from './firebase.js';

class SignIn extends Component {
  render() {
    return (
      <div className="signin__container">
        <div className="signin__button">
          <GoogleButton
            onClick={this.doSignIn_}
          />
        </div>
      </div>
    );
  }

  doSignIn_ = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.props.doSignIn(result.user.displayName, result.user.email);
      });
  }
}

export default SignIn;
