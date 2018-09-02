import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayerArea.css";
import FaceDownDeck from "./FaceDownDeck";
import CardInPlay from "./CardInPlay";

class PlayerArea extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    turnedCard: PropTypes.object,
    updateTurnedCard: PropTypes.func.isRequired,
    setDraggingToSpaceline: PropTypes.func.isRequired,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired,
  };

  render() {
    let content;
    content = this.seedPhase_missionPhase_();
    return content;
  }



  // render content methods, by game phase
  seedPhase_missionPhase_ = () => {
    if (!this.props.game || !this.props.game.state.locations || !this.props.game.state[this.props.userId] ||
        !this.props.game.state[this.props.userId].mission) {
      return <div />;
    }

    let cardInPlay;
    if (this.props.turnedCard && this.containerEl) {
      cardInPlay = (
        <CardInPlay
          card={this.props.turnedCard}
          x={Math.floor((window.innerWidth - this.props.cardWidthInPx) / 2.0)}
          y={20}
          cardWidthInPx={this.props.cardWidthInPx}
          showDetailsFor={this.props.showDetailsFor}
          dontShowDetails={this.props.dontShowDetails}
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
            game={this.props.game}
            numberOfCards={this.props.game.state[this.props.userId].mission.length}
            onClick={this.onUserClickOnMissionDeck_}
            flashTurnStatus={this.props.flashTurnStatus}
          />
        </div>
      </div>
    );
  };

  onUserClickOnMissionDeck_ = () => {
    const turnedCard = this.props.game.state[this.props.userId].mission.shift();
    this.props.updateTurnedCard(turnedCard);
  };

  onTurnedCardDragStart_ = () => {
    this.props.setDraggingToSpaceline(true);
  };

  onTurnedCardDragEnd_ = () => {
    this.props.setDraggingToSpaceline(false);
  };
}

export default PlayerArea;
