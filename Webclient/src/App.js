import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import SignIn from './SignIn';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false
    };
  }

  render() {
    return (
      <div>
        <Route exact path="/" render={props => (
          <SignIn doSignIn={this.doSignin_} />
        )}/>
      </div>
    );
  }

  doSignin_ = () => {
    console.log('SIGN IN!');
  }
}

export default App;
