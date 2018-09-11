import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayerArea.css";
import FaceDownDeck from "./FaceDownDeck";
import CardInPlay from "./CardInPlay";

class PlayerArea extends Component {
  static propTypes = {
    showDebug: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    turnedCard: PropTypes.object,
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
    const card = this.props.game.state[this.props.userId].cardInPlay;
    if (card && this.containerEl) {
      cardInPlay = (
        <CardInPlay
          card={card}
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
            flashTurnStatus={this.props.flashTurnStatus}
            deckName="mission"
          />
        </div>
      </div>
    );
  };

  onTurnedCardDragStart_ = () => {
    this.props.setDraggingToSpaceline(true);
  };

  onTurnedCardDragEnd_ = () => {
    this.props.setDraggingToSpaceline(false);
  };
}

export default PlayerArea;
