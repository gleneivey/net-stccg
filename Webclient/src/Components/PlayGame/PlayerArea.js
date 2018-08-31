import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayerArea.css";
import FaceDownDeck from "./FaceDownDeck";
import CardInPlay from "./CardInPlay";

class PlayerArea extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    turnedCardId: PropTypes.string,
    updateTurnedCard: PropTypes.func.isRequired,
    setDraggingToSpaceline: PropTypes.func.isRequired,
  };

  render() {
    let content;
    content = this.seedPhase_missionPhase_();
    return content;
  }



  // render content methods, by game phase
  seedPhase_missionPhase_ = () => {
    if (!this.props.game || !this.props.game.state.locations || !this.props.game.state[this.props.userId]) {
      return <div />;
    }

    let cardInPlay;
    if (this.props.turnedCardId && this.containerEl) {
      cardInPlay = (
        <CardInPlay
          cardId={this.props.turnedCardId}
          x={Math.floor((window.innerWidth - this.props.cardWidthInPx) / 2.0)}
          y={20}
          cardWidthInPx={this.props.cardWidthInPx}
          onDragStart={this.onTurnedCardDragStart_}
          onDragEnd={this.onTurnedCardDragEnd_}
        />
      );
    }

    return (
      <div className="playerArea__container" ref={el => (this.containerEl = el)}>
        {cardInPlay}
        <div className="playerArea__centerInArea">
          <FaceDownDeck
            numberOfCards={this.props.game.state[this.props.game.playerId].mission.length}
            onClick={this.onUserClickOnMissionDeck_}
          />
        </div>
      </div>
    );
  };

  onUserClickOnMissionDeck_ = () => {
    const turnedCardId = this.props.game.state[this.props.userId].mission.shift();
    this.props.updateTurnedCard(turnedCardId);
  };

  onTurnedCardDragStart_ = () => {
    this.props.setDraggingToSpaceline(true);
  };

  onTurnedCardDragEnd_ = () => {
    this.props.setDraggingToSpaceline(false);
  };
}

export default PlayerArea;
