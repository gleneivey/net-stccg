import React, { Component } from "react";
import PropTypes from "prop-types"
import "./OpponentArea.css";

import cardData from "../../CardData/data";
const { cardMap } = cardData;

class OpponentArea extends Component {
  static propTypes = {
    showDebug: PropTypes.bool.isRequired,
    game: PropTypes.object.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired,
  };

  render() {
    let maybeCardInPlay;
    const card = this.cardInPlay_();
    if (card) {
      const cardData = cardMap[card.id];
      const width = Math.floor(0.7 * this.props.cardWidthInPx);
      const x = Math.floor((window.innerWidth - width) / 2.0);
      const y = 30;

      maybeCardInPlay = (
        <img
          src={cardData.imageUrl} className="cardInPlay__cardImage"
          alt={"Image of card '" + cardData.name + "'"}
          style={{
            top: y,
            left: x,
            width: width,
          }}
          onMouseEnter={this.onMouseEnter_}
          onMouseLeave={this.props.dontShowDetails}
        />
      );
    }

    return <div className="opponentArea__container">
      {maybeCardInPlay}
    </div>;
  }

  cardInPlay_ = () => {
    const opponent = this.props.game.myOpponent();
    if (!opponent) { return null; }
    const opponentInfo = this.props.game.state[opponent];
    if (!opponentInfo) { return null; }
    return opponentInfo.cardInPlay;
  };

  onMouseEnter_ = () => {
    this.props.showDetailsFor(this.cardInPlay_().id);
  };
}

export default OpponentArea;
