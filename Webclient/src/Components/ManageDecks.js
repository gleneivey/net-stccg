import React, { Component } from "react";
import PropTypes from "prop-types"
import { Link } from "react-router-dom";
import "./ManageDecks.css";
import Profile from "./Profile";
import DeckSelector from "./DeckSelector";
import DeckEditor from "./DeckEditor";
import { firestore } from "../firebase.js";
import badgeIconCommand from "../Assets/badge-icon-command.svg"
import Deck from "../Models/Deck";

class ManageDecks extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    doSignOut: PropTypes.func.isRequired,
    setCurrentDeck: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      haveDecks: false,
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

    let selectionControls;
    if (this.state.haveDecks) {
      selectionControls = (
        <div>
          <DeckSelector
            userId={this.props.userId}
            decks={this.state.decks}
            currentDeckIndex={this.state.currentDeckIndex}
            doDeckSelect={this.doDeckSelect_}
            onDeckAdded={this.onDeckAdded_}
          />
          <hr />
          <DeckEditor
            userId={this.props.userId}
            deck={currentDeck}
          />
        </div>
      );
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
        {selectionControls}
      </div>
    );
  }

  fetchDecksIntoState_ = () => {
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

        self.props.setCurrentDeck(decks[0]);
        self.setState({
          haveDecks: true,
          decks: decks,
          currentDeckIndex: 0
        });
      })
      .catch(function(error) {
        console.log("Error getting 'decs' documents: ", error);
      });
  };

  doDeckSelect_ = (deckId) => {
    const newIndex = this.state.decks.findIndex(deck => deck.id === deckId);
    this.props.setCurrentDeck(this.state.decks[newIndex]);
    this.setState({currentDeckIndex: newIndex});
  };

  onDeckAdded_ = () => {
    this.fetchDecksIntoState_();
  };
}

export default ManageDecks;
