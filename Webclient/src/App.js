import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import SignIn from './SignIn';
import Decks from './Decks';
import firebase, { firestore } from './firebase';
import spinner from './stccg-logo.png'

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

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          signedIn: true,
          displayName: user.displayName,
          email: user.email
        });
        this.getOrCreateUser_();
      }
    });
  }

  render() {
    return (
      <div className="app__container">
        <Route
          exact
          path="/"
          render={props => {
            if (!this.state.signedIn) {
              return (
                <SignIn doSignIn={this.doSignIn_}/>
              );
            } else if (!this.state.userId) {
              return (
                <div className="authSpinner__container">
                  <img src={spinner} className="authSpinner__spinner" alt="Authorization in progress" />
                </div>
              );
            } else {
              return (
                <Decks
                  userId={this.state.userId}
                  displayName={this.state.displayName}
                  doSignOut={this.doSignOut_}
                />
              );
            }
          }}
        />
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
