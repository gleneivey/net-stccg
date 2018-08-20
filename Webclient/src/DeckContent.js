import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './DeckContent.css';
import SubDeck from './SubDeck';

class DeckContent extends Component {
  static propTypes = {
    deck: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      deck:  JSON.parse( JSON.stringify(props.deck) )
    };
  }

  /* Deck data structure is:
      {
        mission: [],
        site: [],    // not yet supported
        seed: [],
        draw: []
      }
   */

  render() {
    return (
      <div className="deckContent__container">
        <h3>Seed-Phase Decks</h3>
        <h4>Mission Deck</h4>
        <SubDeck cards={this.state.deck.mission} min={6} max={6} numbered={true} />
        <h4>Seed Deck</h4>
        <SubDeck cards={this.state.deck.seed} max={30} numbered={true} />
        <h3>Play-Phase Decks</h3>
        <h4>Draw Deck</h4>
        <SubDeck cards={this.state.deck.draw} min={30} numbered={true} />
      </div>
    );
  }
}

export default DeckContent;
