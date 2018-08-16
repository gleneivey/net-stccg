import React, { Component } from 'react';
import './Decks.css';
import Profile from './Profile';
import DeckSelector from './DeckSelector';
import Deck from './Deck';
import { firestore } from './firebase.js';

class Decks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: [],
      currentDeckIndex: null
    };
  }

  componentDidMount() {
    this.fetchDecksIntoState_();
  }

  render() {
    const currentDeck = !!this.state.currentDeckIndex && this.state.decks[this.state.currentDeckIndex];
    return (
      <div>
        <Profile
          displayName={this.props.displayName}
          doSignOut={this.props.doSignOut}
        />
        <DeckSelector
          decks={this.state.decks}
          currentDeckIndex={this.state.currentDeckIndex}
          doDeckSelect={this.doDeckSelect_}
          onDeckAdded={this.onDeckAdded_}
        />
        <Deck
          userId={this.props.userId}
          deckId={currentDeck && currentDeck.id}
        />
      </div>
    );
  }

  fetchDecksIntoState_ = () => {
    const self = this;
    const db = firestore();
    db
      .collection('users')
      .doc(this.props.userId)
      .collection('decks')
      .get()
      .then(function(querySnapshot) {
        let decks = [];
        querySnapshot.forEach(function(doc) {
console.log(doc.id, " => ", doc.data());
          decks.push(doc.data());
        });
        self.setState({decks: decks});
      })
      .catch(function(error) {
        console.log("Error getting 'decs' documents: ", error);
      });
  };

  doDeckSelect_ = () => {

  };

  onDeckAdded_ = () => {
    this.fetchDecksIntoState_();
  };
}

export default Decks;
