import React, { Component } from "react";
import PropTypes from "prop-types"
import { Link } from "react-router-dom";
import "./ManageDecks.css";
import Profile from "../Profile";
import DeckSelector from "./DeckSelector";
import DeckEditor from "./DeckEditor";
import { firestore } from "../../firebase.js";
import badgeIconCommand from "../../Assets/badge-icon-command.svg"
import Deck from "../../Models/Deck";

class ManageDecks extends Component {
  static propTypes = {
    showDebug: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    doSignOut: PropTypes.func.isRequired,
    setCurrentDeck: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      haveDecks: false,
      addingADeck: false,
      decks: [],
      currentDeckIndex: null
    };
  }

  componentDidMount() {
    this.fetchDecksIntoState_();
  }

  render() {
    let currentDeck = null;
    if (this.state.currentDeckIndex != null) {
      currentDeck = this.state.decks[this.state.currentDeckIndex];
    }

    let deckSelector, deckEditor;
    if (this.state.haveDecks) {
      deckSelector = (
        <DeckSelector
          userId={this.props.userId}
          decks={this.state.decks}
          currentDeckIndex={this.state.currentDeckIndex}
          addingADeck={this.state.addingADeck}
          updateAddingADeck={this.updateAddingADeck_}
          doDeckSelect={this.doDeckSelect_}
          onDeckAdded={this.onDeckAdded_}
        />
      );

      if (!this.state.addingADeck) {
        deckEditor = (
          <div>
            <hr />
            <DeckEditor
              showDebug={this.props.showDebug}
              userId={this.props.userId}
              deck={currentDeck}
            />
          </div>
        );
      }
    }

    return (
      <div>
        <Profile
          displayName={this.props.displayName}
          doSignOut={this.props.doSignOut}
        />
        <Link className="decks__startGame" to="/start">
          Start Game
          <img src={badgeIconCommand} className="decks__startArrow" alt="" />
        </Link>
        <h1 className="decks__title">Your Decks</h1>
        {deckSelector}
        {deckEditor}
      </div>
    );
  }

  fetchDecksIntoState_ = (maybeNewDeckId) => {
    const self = this;
    const db = firestore();

    db
      .collection('users')
      .doc(self.props.userId)
      .collection('decks')
      .get()
      .then(function(querySnapshot) {
        let decks = [];

        querySnapshot.forEach(function(doc) {
          let deck = doc.data();
          deck.id = doc.id;
          Deck.ensureDeckDefaults(deck);
          decks.push(deck);
        });

        let newDeckIndex;
        if (maybeNewDeckId) {
          newDeckIndex = decks.findIndex(deck => deck.id === maybeNewDeckId);
          self.props.setCurrentDeck(decks[newDeckIndex]);
        } else {
          newDeckIndex = 0;
          self.props.setCurrentDeck(decks[0]);
        }

        self.setState({
          haveDecks: true,
          decks: decks,
          currentDeckIndex: newDeckIndex
        });
      })
      .catch(function(error) {
        console.log("Error getting 'decs' documents: ", error);
      });
  };

  updateAddingADeck_ = (newValue) => {
    this.setState({addingADeck: newValue});
  };

  doDeckSelect_ = (deckId) => {
    const newIndex = this.state.decks.findIndex(deck => deck.id === deckId);
    this.props.setCurrentDeck(this.state.decks[newIndex]);
    this.setState({currentDeckIndex: newIndex});
  };

  onDeckAdded_ = (newDeckId) => {
    this.fetchDecksIntoState_(newDeckId);
  };
}

export default ManageDecks;
