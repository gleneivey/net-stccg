import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import SignIn from './SignIn';
import Decks from './Decks';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      displayName: null,
      email: null
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
  };

  doSignOut_ = () => {
console.log("App#doSignOut_");
    this.setState({
      signedIn: false
    });
  };
}

export default App;
