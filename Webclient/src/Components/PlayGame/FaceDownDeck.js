import React, { Component } from "react";
import PropTypes from "prop-types"
import "./FaceDownDeck.css";
import cardBack from "../../Assets/stccg-card-back.gif"

class FaceDownDeck extends Component {
  static propTypes = {
    numberOfCards: PropTypes.number.isRequired,
    onClick: PropTypes.func
  };

  render() {
console.log("FaceDownDeck#render");
console.log(this.props.numberOfCards);
    let pseudoDeckSize;
    if (this.props.numberOfCards === 0) {
      pseudoDeckSize = 0;
    } else {
      pseudoDeckSize= Math.floor(Math.log(this.props.numberOfCards)/Math.LN2);
      pseudoDeckSize = pseudoDeckSize < 1 ? 1 : pseudoDeckSize;
    }

    const cardbackOffsets = [];
    for (let c=pseudoDeckSize-1; c >= 0; c--) {
      cardbackOffsets.push(c * 8);
    }
console.log(cardbackOffsets);

    return <div className="faceDownDeck__container" onClick={this.onClick_}>
      {cardbackOffsets.map(offset => (
        <img
          src={cardBack} className="faceDownDeck__cardBack"
          style={ {top:offset, left:offset} }
          key={offset}
          alt="Face-down card"
        />
      ))}
    </div>;
  }

  onClick_ = (event) => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };
}

export default FaceDownDeck;
