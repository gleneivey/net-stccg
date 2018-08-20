import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import './App.css';
import SignIn from './SignIn';
import Decks from './Decks';
import StartGame from './StartGame';
import PlayGame from './PlayGame';
import firebase, { firestore } from './firebase';
import spinner from './stccg-logo.png'

class App extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      displayName: null,
      email: null,
      userId: null,
      user: null,
      currentDeck: null,
      currentGameId: null,
      opponent: null
    };
  }

  componentDidMount() {
    this.checkIfAlreadySignedIn_();
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
                  setCurrentDeck={this.setCurrentDeck_}
                />
              );
            }
          }}
        />
        <Route
          path="/start"
          render={props => {
            return (
              <StartGame
                userId={this.state.userId}
                displayName={this.state.displayName}
                deck={this.state.currentDeck}

                doSignOut={this.doSignOut_}
                doStartPlaying={this.doStartPlaying_}
              />
            );
          }}
        />
        <Route
          path="/play"
          render={props => {
            return (
              <PlayGame
                userId={this.state.userId}
                displayName={this.state.displayName}

                player={this.state.user}
                deck={this.state.currentDeck}
                opponent={this.state.opponent}
                currentGameId={this.state.currentGameId}

                doSignOut={this.doSignOut_}
              />
            );
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
    firebase.auth().signOut();
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
          const user = {
            displayName: self.state.displayName,
            email: self.state.email
          };

          db
            .collection("users")
            .add(user)
            .then(function(docRef) {
              user.id = docRef.id;
              self.setState({
                userId: docRef.id,
                user: user
              });
            })
            .catch(function(error) {
              console.log("Error writing new 'user' document: ", error);
            });
        } else {
          const id = querySnapshot.docs[0].id;
          const user = querySnapshot.docs[0].data();
          user.id = id;
          self.setState({
            userId: id,
            user: user
          });
        }
      })
      .catch(function(error) {
        console.log("Error getting 'user' document: ", error);
      });
  };

  setCurrentDeck_ = (deck) => {
    this.setState({currentDeck: deck});
  };

  doStartPlaying_ = (offerId, opponent) => {
    this.setState({
      currentGameId: offerId,
      opponent: opponent
    });
    this.props.history.push('/play')
  };

  checkIfAlreadySignedIn_ = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let displayName = user.displayName;
        if (!displayName || displayName.length === 0) {
          displayName = user.email;
        }

        this.setState({
          signedIn: true,
          displayName: displayName,
          email: user.email
        });
        this.getOrCreateUser_();
      }
    });
  };
}

export default withRouter(App);
