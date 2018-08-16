import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import SignIn from './SignIn';
import Decks from './Decks';
import { firestore } from './firebase.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      displayName: null,
      email: null,
      userId: null
    };
  }

  render() {
    return (
      <div>
        <Route exact path="/" render={props => {
          if (this.state.signedIn) {
            return (
              <Decks
                displayName={this.state.displayName}
                doSignOut={this.doSignOut_}
              />
            );
          } else {
            return (
              <SignIn doSignIn={this.doSignIn_}/>
            );
          }
        }}/>
      </div>
    );
  }

  doSignIn_ = (displayName, email) => {
    this.setState({
      signedIn: true,
      displayName: displayName,
      email: email
    });
    this.getOrCreateUser_();
  };

  doSignOut_ = () => {
    this.setState({
      signedIn: false,
      userId: null
    });
  };

  getOrCreateUser_ = () => {
    const self = this;
    const db = firestore();

    db
      .collection("users")
      .where("email", "==", self.state.email)
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.empty) {
          db
            .collection("users")
            .add({
              displayName: self.state.displayName,
              email: self.state.email
            })
            .then(function(docRef) {
              self.setState({userId: docRef.id});
            })
            .catch(function(error) {
              console.log("Error writing new 'user' document: ", error);
            });
        } else {
          self.setState({userId: querySnapshot.docs[0].id});
        }
      })
      .catch(function(error) {
        console.log("Error getting 'user' document: ", error);
      });
  }
}

export default App;
