import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './AvailableCards.css';

import cardData from './CardData/data'
const { cards, cardMap } = cardData;

class AvailableCards extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetailsFor: null
    };
  }

  componentDidMount() {
    this.fixupListHeight_();
  }

  componentDidUpdate() {
    this.fixupListHeight_();
  }

  render() {
    let maybeDetails = null;
    if (this.state.showDetailsFor) {
      const card = cardMap[this.state.showDetailsFor];
      maybeDetails = (
        <img src={card.imageUrl} className="availableCards__cardDetail" alt={"Image of card '" + card.name + "'"} />
      );
    }

    return (
      <div className="availableCards__container" ref={el => (this.containerEl = el)}>
        {maybeDetails}
        <ul className="availableCards__scrollList">
          {cards.map(card => (
            <li
              className="availableCards__card"
              cardid={card.id}
              key={card.id}
              onMouseEnter={this.onMouseEnter_}
              onMouseLeave={this.onMouseLeave_}
            >
              {card.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  fixupListHeight_ = () => {
    this.containerEl.style.height = (window.innerHeight - this.containerEl.offsetTop) + "px";
  };

  onMouseEnter_ = (event) => {
    this.setState({showDetailsFor: event.target.getAttribute("cardid")});
  };

  onMouseLeave_ = (event) => {
    this.setState({showDetailsFor: null});
  };
}

export default AvailableCards;
