import React, { Component } from 'react';
import './Decks.css';
import Profile from './Profile';

class Decks extends Component {
  render() {
    return (
      <div>
        <Profile
          displayName={this.props.displayName}
          doSignOut={this.props.doSignOut}
        />
      </div>
    );
  }
}

export default Decks;
