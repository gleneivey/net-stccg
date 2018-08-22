import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './DeckContent.css';
import SubDeck from './SubDeck';
import DeckContentDelete from './DeckContentDelete';
import { firestore } from './firebase';


class DeckContent extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    deck: PropTypes.object.isRequired,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired
  };

  /* Deck data structure is:
      {
        name: "string",
        mission: [],
        site: [],    // not yet supported
        seed: [],
        draw: []
      }
   */

  constructor(props) {
    super(props);
    this.state = {
      deck: JSON.parse( JSON.stringify(props.deck) ),
      updateMissionSubdeck: updateFunctionFor_(this, 'mission'),
      updateSeedSubdeck: updateFunctionFor_(this, 'seed'),
      updateDrawSubdeck: updateFunctionFor_(this, 'draw'),
    };
  }

  render() {
    return (
      <div className="deckContent__container">
        <DeckContentDelete removeCardFromSubDeck={this.removeCardFromSubDeck_} />
        <h3>Seed-Phase Decks</h3>
        <h4>Mission Deck</h4>
        <SubDeck
          type="mission"
          cardIds={this.state.deck.mission}
          min={6} max={6}
          updateCardIdsInSubDeck={this.state.updateMissionSubdeck}
          showDetailsFor={this.props.showDetailsFor}
          dontShowDetails={this.props.dontShowDetails}
        />
        <h4>Seed Deck</h4>
        <SubDeck
          type="seed"
          cardIds={this.state.deck.seed}
          max={30}
          updateCardIdsInSubDeck={this.state.updateSeedSubdeck}
          showDetailsFor={this.props.showDetailsFor}
          dontShowDetails={this.props.dontShowDetails}
        />

        <DeckContentDelete removeCardFromSubDeck={this.removeCardFromSubDeck_} />
        <h3>Play-Phase Decks</h3>
        <h4>Draw Deck</h4>
        <SubDeck
          type="draw"
          cardIds={this.state.deck.draw}
          min={30}
          updateCardIdsInSubDeck={this.state.updateDrawSubdeck}
          showDetailsFor={this.props.showDetailsFor}
          dontShowDetails={this.props.dontShowDetails}
        />
      </div>
    );
  }

  removeCardFromSubDeck_ = (item) => {
    const subdeckName = item.fromSubdeck;
    let subdeck = this.state.deck[subdeckName];
    const toRemove = subdeck.indexOf(item.cardId);
    if (toRemove === -1) {
      console.log("WARNING!!!!  Couldn't find item to remove from SubDeck", item);
      return;
    }

    subdeck.splice(toRemove, 1);
    let deck = this.state.deck;
    deck[subdeckName] = Array.from(subdeck);
    this.setState({deck: deck});

    updateSubDeckInDb_(this.props, subdeckName, subdeck);
  };
}

function updateSubDeckInDb_(props, subdeckName, subdeckCardIds) {
  let deckUpdate = {};
  deckUpdate[subdeckName] = subdeckCardIds;

  const db = firestore();
  db
    .collection("users")
    .doc(props.userId)
    .collection("decks")
    .doc(props.deck.id)
    .update(deckUpdate);
}

function updateFunctionFor_(instance, subdeck) {
  const fn = function (cardIds) {
    let deck = this.state.deck;
    deck[subdeck] = cardIds;
    this.setState({deck: deck});

    updateSubDeckInDb_(this.props, subdeck, cardIds);
  };

  return fn.bind(instance);
}


export default DeckContent;
