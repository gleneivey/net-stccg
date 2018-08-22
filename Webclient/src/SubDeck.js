import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import './SubDeck.css';
import CardName from './CardName';

import cardData from './CardData/data'
const { cardMap } = cardData;

class SubDeck extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    cardIds: PropTypes.array.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    updateCardIdsInSubDeck: PropTypes.func.isRequired,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired,

    // Injected by React DnD:
    connectDropTarget: PropTypes.func.isRequired
  };

  render() {
    let itemCount = -1;
    let itemsFromPropsCards = (
      <ol className="subdeckCards__list">
        {this.props.cardIds.map(cardId => {
          itemCount++;
          return (
            <li
              className="subdeckCards__card"
              cardid={cardId}
              key={itemCount}
            >
              <CardName
                card={cardMap[cardId]}
                inSubDeck={this.props.type}
                showDetailsFor={this.props.showDetailsFor}
                dontShowDetails={this.props.dontShowDetails}
              />
            </li>
          );
        })}
      </ol>
    );

    let endOfList;
    const wantAnExactNumber = (this.props.min == this.props.max);
    let message;
    let playable = true;

    if (wantAnExactNumber) {
      if (this.props.max != this.props.cardIds.length) {
        playable = false;
        message = this.props.cardIds.length === 0 ?
          "Need exactly " + this.props.min + " cards" :
          "Need " + (this.props.max - this.props.cardIds.length) + " more cards";
      }
    } else if (Number.isInteger(this.props.min)) {
      if (this.props.cardIds.length < this.props.min) {
        playable = false;
        message = this.props.cardIds.length === 0 ?
          "At least " + this.props.min + " cards" :
          "At least " + (this.props.min - this.props.cardIds.length) + " more cards";
      }
    } else if (Number.isInteger(this.props.max)) {
      if (this.props.cardIds.length < this.props.max) {
        message = this.props.cardIds.length === 0 ?
          "Up to " + this.props.max + " cards" :
          "Up to " + (this.props.max - this.props.cardIds.length) + " more cards";
      }
    } else {
    }

    if (message) {
      const messageClasses = classNames({
        "subdeckCards__endOfList": true,
        "subdeckCards__endOfList--warning": !playable
      });
      endOfList = <div className={messageClasses}>{message}</div>;
    }

    return this.props.connectDropTarget(
      <div className="subdeckCards__container">
        {itemsFromPropsCards}
        {endOfList}
      </div>
    );
  }

  addDroppedCardToThisSubDeck_ = (cardItem) => {
    this.props.updateCardIdsInSubDeck(
      this.props.cardIds.concat([cardItem.cardId])
    );
  };
}


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

const specification = {
  drop: function (props, monitor, component) {
    component.addDroppedCardToThisSubDeck_(monitor.getItem());
  }
};

export default DropTarget("card", specification, collect)(SubDeck);
