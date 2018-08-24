import React, { Component } from "react";
import PropTypes from "prop-types"
import { DropTarget } from "react-dnd";
import classNames from "classnames";
import "./SubDeckEditor.css";
import CardName from "./CardName";
import subDeckFactory from "../../Models/subDeckFactory";

import metadata from "../../CardData/metadata"
import cardData from "../../CardData/data"
const { cardMap } = cardData;

class SubDeckEditor extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    cardIds: PropTypes.array.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    updateCardIdsInSubDeck: PropTypes.func.isRequired,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired,

    // Injected by React DnD:
    connectDropTarget: PropTypes.func.isRequired,
    cantDrop: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      closed: false
    };
  }

  render() {
    const containerClasses = classNames({
      "subdeckCards__container": true,
      "subdeckCards__container--closed": this.state.closed
    });
    const listClasses = classNames({
      "subdeckCards__list": true,
      "subdeckCards__list--cantDrop": this.props.cantDrop
    });

    let listAndEnd;
    if (!this.state.closed) {
      let itemCount = -1;
      let itemsFromPropsCards = (
        <ol className={listClasses}>
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
      const wantAnExactNumber = (this.props.min === this.props.max);
      let message;
      let playable = true;

      if (wantAnExactNumber) {
        if (this.props.max !== this.props.cardIds.length) {
          playable = false;
          const difference = this.props.max - this.props.cardIds.length;
          message = this.props.cardIds.length === 0 ?
            "Need exactly " + this.props.min + " cards" :
            "Need " + difference + " more card" + (difference === 1 ? "" : "s");
        }
      } else if (Number.isInteger(this.props.min)) {
        if (this.props.cardIds.length < this.props.min) {
          playable = false;
          const difference = this.props.min - this.props.cardIds.length;
          message = this.props.cardIds.length === 0 ?
            "At least " + this.props.min + " cards" :
            "At least " + difference + " more card" + (difference === 1 ? "" : "s");
        }
      } else if (Number.isInteger(this.props.max)) {
        if (this.props.cardIds.length < this.props.max) {
          const difference = this.props.max - this.props.cardIds.length;
          message = this.props.cardIds.length === 0 ?
            "Up to " + this.props.max + " cards" :
            "Up to " + difference + " more card" + (difference === 1 ? "" : "s");
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

      listAndEnd = (
        <div className="subdeckCards__listAndEnd">
          {itemsFromPropsCards}
          {endOfList}
        </div>
      );
    }

    return this.props.connectDropTarget(
      <div className={containerClasses}>
        <h4 onClick={this.toggleOpenClose_}>{metadata.deckNames[this.props.type]}</h4>
        {listAndEnd}
      </div>
    );
  }

  toggleOpenClose_ = () => {
    this.setState({closed: !this.state.closed});
  };

  addDroppedCardToThisSubDeck_ = (cardItem) => {
    this.props.updateCardIdsInSubDeck(
      this.props.cardIds.concat([cardItem.cardId])
    );
  };
}


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    cantDrop: monitor.isOver() && !monitor.canDrop()
  };
}

const specification = {
  drop: function (props, monitor, component) {
    component.addDroppedCardToThisSubDeck_(monitor.getItem());
  },
  canDrop: function (props, monitor) {
    return (!props.max || (props.max > props.cardIds.length)) &&
      subDeckFactory(props.type, props.cardIds).canContainCard(monitor.getItem().cardId);
  }
};

export default DropTarget("card", specification, collect)(SubDeckEditor);
