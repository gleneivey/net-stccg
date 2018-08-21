import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd';
import './SubDeck.css';
import CardName from './CardName';

import cardData from './CardData/data'
const { cardMap } = cardData;

class SubDeck extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    cardIds: PropTypes.array.isRequired,
    numbered: PropTypes.bool.isRequired,
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

    return this.props.connectDropTarget(
      <div className="subdeckCards__container">
        {itemsFromPropsCards}
        <div className="subdeckCards__endOfList">
          &nbsp;
        </div>
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
