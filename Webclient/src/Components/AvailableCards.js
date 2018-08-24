import React, { Component } from "react";
import PropTypes from "prop-types"
import "./DeckEditor.css";
import "./AvailableCards.css";
import CardName from "./CardName";
import domTools from "../domTools";

import cardData from "../CardData/data"
const { cards } = cardData;

class AvailableCards extends Component {
  static propTypes = {
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired
  };

  componentDidMount() {
    domTools.fixupListHeight(this);
  }

  componentDidUpdate() {
    domTools.fixupListHeight(this);
  }

  render() {
    let shownCards = cards.sort((a,b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);

    return (
      <div className="availableCards__container" ref={el => (this.containerEl = el)}>
        <ul className="availableCards__scrollList">
          {shownCards.map(card => (
            <li
              className="availableCards__card"
              cardid={card.id}
              key={card.id}
            >
              <CardName
                card={card}
                showDetailsFor={this.props.showDetailsFor}
                dontShowDetails={this.props.dontShowDetails}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default AvailableCards;
