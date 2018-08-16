import React, { Component } from 'react';
import './DeckSelector.css';
import { firestore } from './firebase.js';

class DeckSelector extends Component {
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
            <a onClick={this.changeToSelecting_}>cancel</a>
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
    this.setState({selecting: true});
  };

  updateNewDeckName_ = (event) => {
    this.setState({newDeckName: event.target.value});
  };

  addDeck_ = () => {
    const self = this;
    const db = firestore();
    db
      .collection('users')
      .doc(this.props.userId)
      .collection('decks')
      .add({
        name: this.state.newDeckName
      })

    this.setState({selecting: true});
    this.props.onDeckAdded();
  };
}

export default DeckSelector;
