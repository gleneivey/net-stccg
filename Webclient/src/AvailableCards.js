import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './AvailableCards.css';
import Card from './Card';

import cardData from './CardData/data'
const { cards } = cardData;

class AvailableCards extends Component {
  static propTypes = {
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.fixupListHeight_();
  }

  componentDidUpdate() {
    this.fixupListHeight_();
  }

  render() {
    return (
      <div className="availableCards__container" ref={el => (this.containerEl = el)}>
        <ul className="availableCards__scrollList">
          {cards.map(card => (
            <li
              className="availableCards__card"
              cardid={card.id}
              key={card.id}
            >
              <Card
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

  fixupListHeight_ = () => {
    this.containerEl.style.height = (window.innerHeight - this.containerEl.offsetTop) + "px";
  };
}

export default AvailableCards;
