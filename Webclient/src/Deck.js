import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './Deck.css';
import AvailableCards from './AvailableCards';
import DeckContent from './DeckContent';

import cardData from './CardData/data'
const { cardMap } = cardData;

class Deck extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    deck: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetailsFor: null
    };
  }

  render() {
    if (!this.props.deck) {
      return <div />;
    }

    let maybeDetails = null;
    if (this.state.showDetailsFor) {
      const card = cardMap[this.state.showDetailsFor];
      maybeDetails = (
        <img src={card.imageUrl} className="deck__cardDetail" alt={"Image of card '" + card.name + "'"} />
      );
    }

    return (
      <div>
        {maybeDetails}
        <h2 className="deck__name">{this.props.deck.name}</h2>
        <DeckContent
          deck={this.props.deck}
          showDetailsFor={this.showDetailsFor_}
          dontShowDetails={this.dontShowDetails_}
        />
        <AvailableCards
          showDetailsFor={this.showDetailsFor_}
          dontShowDetails={this.dontShowDetails_}
        />
      </div>
    );
  }

  showDetailsFor_ = (cardId) => {
    this.setState({showDetailsFor: cardId});
  };

  dontShowDetails_ = () => {
    this.setState({showDetailsFor: null});
  };
}

export default DragDropContext(HTML5Backend)(Deck);
