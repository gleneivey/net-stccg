import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './DeckSelector.css';
import { firestore } from './firebase.js';

class DeckSelector extends Component {
  static propTypes = {
    decks: PropTypes.array.isRequired,
    currentDeckIndex: PropTypes.number,
    userId: PropTypes.string.isRequired,
    onDeckAdded: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selecting: true,
      newDeckName: ""
    };
  }

  render() {
    return (
      <div>
        { this.state.selecting ? (
          <div className="deckSelector__selection">
            {this.selectorOrEmptyMessage_()}
            <button
              className="button"
              onClick={this.changeToAdding_}
            >Add Deck</button>
          </div>
        ) : (
          <div className="deckSelector__add">
            <label>Name for new deck:</label>
            <input
              type="text"
              value={this.state.newDeckName}
              onChange={this.updateNewDeckName_}
            />
            <button
              className="button"
              onClick={this.addDeck_}
            >Save Deck</button>
            <a className="deckSelector__cancel" onClick={this.changeToSelecting_}>cancel</a>
          </div>
        )}
      </div>
    );
  }

  selectorOrEmptyMessage_ = () => {
    if (this.props.decks.length > 0) {
      return (
        <div>
          <label>Choose a Deck:</label>
          <select
            value={this.props.decks[this.props.currentDeckIndex].id}
            onChange={this.selectionChanged_}
          >
            {this.props.decks.map(deck => (
              <option
                key={deck.id}
                value={deck.id}
              >
                {deck.name}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      return (
        <div className="deckSelector__placeholderText">You'll have to add a deck to proceed.</div>
      );
    }
  };

  changeToAdding_ = () => {
    this.setState({selecting: false});
  };

  changeToSelecting_ = () => {
    this.setState({
      newDeckName: '',
      selecting: true
    });
  };

  updateNewDeckName_ = (event) => {
    this.setState({newDeckName: event.target.value});
  };

  addDeck_ = () => {
    const self = this;
    const db = firestore();
    db
      .collection('users')
      .doc(self.props.userId)
      .collection('decks')
      .add({
        name: self.state.newDeckName
      })
      .then(function(docRef) {
        self.setState({selecting: true});
        self.props.onDeckAdded();
      })
      .catch(function(error) {
        console.log("Error writing new 'user' document: ", error);
      });
  };

  selectionChanged_ = (event) => {
    this.props.doDeckSelect(event.target.value);
  }
}

export default DeckSelector;
