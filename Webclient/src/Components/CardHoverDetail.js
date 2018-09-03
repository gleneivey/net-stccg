import React, { Component } from "react";
import PropTypes from "prop-types"
import "./CardHoverDetail.css";

import cardData from "../CardData/data";
const { cardMap } = cardData;

class CardHoverDetail extends Component {
  static propTypes = {
    cardId: PropTypes.string
  };

  render() {
    if (!this.props.cardId) {
      return <div />;
    }

    const card = cardMap[this.props.cardId];
    return <div className="cardHoverDetail__container">
      <img src={card.imageUrl} className="cardHoverDetail__image" alt={"Image of card '" + card.name + "'"} />
    </div>;
  }
}

export default CardHoverDetail;
