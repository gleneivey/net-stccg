import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './SubDeck.css';
import cardData from "./CardData/data";
const { cardMap } = cardData;

class SubDeck extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    numbered: PropTypes.bool.isRequired,
    min: PropTypes.number,
    max: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetailsFor: null
    };
  }

  render() {
    let maybeDetails = null;
    if (this.state.showDetailsFor) {
      const card = cardMap[this.state.showDetailsFor];
      maybeDetails = (
        <img src={card.imageUrl} className="availableCards__cardDetail" alt={"Image of card '" + card.name + "'"} />
      );
    }

    let itemCount = 0;
    let itemsFromPropsCards = (
      <ol className="subdeckCards__list">
        {this.props.cards.map(card => {
          itemCount++;
          return (
            <li
              className="subdeckCards__card"
              cardid={card.id}
              key={card.id}
              onMouseEnter={this.onMouseEnter_}
              onMouseLeave={this.onMouseLeave_}
            >
              {card.name}
            </li>
          );
        })}
      </ol>
    );

    return (
      <div className="subdeckCards__container">
        {maybeDetails}
        {itemsFromPropsCards}
        <div className="subdeckCards__endOfList">
          &nbsp;
        </div>
      </div>
    );
  }

  onMouseEnter_ = (event) => {
    this.setState({showDetailsFor: event.target.getAttribute("cardid")});
  };

  onMouseLeave_ = (event) => {
    this.setState({showDetailsFor: null});
  };
}

export default SubDeck;
