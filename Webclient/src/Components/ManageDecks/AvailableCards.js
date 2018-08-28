import React, { Component } from "react";
import PropTypes from "prop-types"
import "./DeckEditor.css";
import "./AvailableCards.css";
import CardName from "./CardName";
import FilterSelector from "./FilterSelector";
import domTools from "../../domTools";
import cardFactory from "../../Models/cardFactory";

import metadata from "../../CardData/metadata";
import cardData from "../../CardData/data";
const { cards } = cardData;

class AvailableCards extends Component {
  static propTypes = {
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      affiliationFilterActive: false,
      affiliationFilters: {},
      cardTypeFilterActive: false,
      cardTypeFilters: {}
    };
  }

  componentDidMount() {
    domTools.fixupListHeight(this);
  }

  componentDidUpdate() {
    domTools.fixupListHeight(this);
  }

  render() {
    let selectedFilters;
    let shownCards = cards.sort((a,b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);

    if (this.state.affiliationFilterActive) {
      selectedFilters = this.selectedFilters_(this.state.affiliationFilters);

      shownCards = shownCards.filter((c) => {
        const card = cardFactory(c);
        return card.doesAffiliationIntersect(selectedFilters);
      });
    }

    if (this.state.cardTypeFilterActive) {
      selectedFilters = this.selectedFilters_(this.state.cardTypeFilters);

      shownCards = shownCards.filter((c) => {
        const card = cardFactory(c);
        return card.doesTypeMatch(selectedFilters);
      });
    }

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
            filters={this.state.affiliationFilters}
            filterActive={this.state.affiliationFilterActive}
            callback={this.affiliationFilterApplier_}
          />
          <FilterSelector
            name="Card Type"
            tags={metadata.cardTypes}
            filters={this.state.cardTypeFilters}
            filterActive={this.state.cardTypeFilterActive}
            callback={this.cardTypeFilterApplier_}
          />
        </div>
      </div>
    );
  }

  selectedFilters_ = (filterHash) => {
    const selectedFilters = [];
    Object.keys(filterHash).forEach((key) => {
      if (filterHash[key]) {
        selectedFilters.push(key);
      }
    });

    return selectedFilters;
  };

  affiliationFilterApplier_ = (active, filters) => {
    this.setState({
      affiliationFilterActive: active,
      affiliationFilters: filters
    });
  };

  cardTypeFilterApplier_ = (active, filters) => {
    this.setState({
      cardTypeFilterActive: active,
      cardTypeFilters: filters
    });
  };
}

export default AvailableCards;
