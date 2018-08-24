import React, { Component } from "react";
import PropTypes from "prop-types"
import "./DeckEditor.css";
import "./AvailableCards.css";
import CardName from "./CardName";
import FilterSelector from "./FilterSelector";
import domTools from "../domTools";

import metadata from "../CardData/metadata"
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
      <div className="availableCards__controls">
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

        <div className="availableCards__filters">
          <h5 className="availableCards__filterHeader">Filter Available Cards By:</h5>
          <FilterSelector
            name="Affiliation"
            tags={metadata.cardAffiliations}
            callback={this.affiliationFilterApplier_}
          />
          <FilterSelector
            name="Card Type"
            tags={metadata.cardTypes}
            callback={this.cardTypeFilterApplier_}
          />
        </div>
      </div>
    );
  }

  affiliationFilterApplier_ = () => {};
  cardTypeFilterApplier_ = () => {};
}

export default AvailableCards;
