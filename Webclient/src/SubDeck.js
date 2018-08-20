import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './SubDeck.css';
import Card from './Card';

class SubDeck extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    numbered: PropTypes.bool.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired
  };

  render() {
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
            >
              <Card
                card={card}
                showDetailsFor={this.props.showDetailsFor}
                dontShowDetails={this.props.dontShowDetails}
              />
            </li>
          );
        })}
      </ol>
    );

    return (
      <div className="subdeckCards__container">
        {itemsFromPropsCards}
        <div className="subdeckCards__endOfList">
          &nbsp;
        </div>
      </div>
    );
  }
}

export default SubDeck;
