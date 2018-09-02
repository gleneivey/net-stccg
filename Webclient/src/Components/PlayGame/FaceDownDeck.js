import React, { Component } from "react";
import PropTypes from "prop-types"
import classNames from "classnames";
import "./FaceDownDeck.css";
import cardBack from "../../Assets/stccg-card-back.gif"

class FaceDownDeck extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    numberOfCards: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    flashTurnStatus: PropTypes.func.isRequired
  };

  render() {
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

    const containerClasses = classNames({
      "faceDownDeck__container": true,
      "faceDownDeck__container--notMyTurn": this.props.game && !this.props.game.isMyTurn()
    });

    return <div className={containerClasses} onClick={this.onClick_}>
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
    if (!this.props.game.isMyTurn()) {
      const self = this;
      this.props.flashTurnStatus(true);
      setTimeout(function (){ self.props.flashTurnStatus(false); }, 200);
      return;
    }

    if (this.props.onClick) {
      this.props.onClick();
    }
  };
}

export default FaceDownDeck;
