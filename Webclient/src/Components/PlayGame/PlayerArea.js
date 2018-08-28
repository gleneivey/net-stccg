import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayerArea.css";
import FaceDownDeck from "./FaceDownDeck";
import CardInPlay from "./CardInPlay";

class PlayerArea extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    setDraggingToSpaceline: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      turnedCard: null
    };
  }

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
    if (this.state.turnedCard && this.containerEl) {
      cardInPlay = (
        <CardInPlay
          cardId={this.state.turnedCard}
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
    this.setState({turnedCard: this.props.game.state[this.props.userId].mission.shift()});
  };

  onTurnedCardDragStart_ = () => {
    this.props.setDraggingToSpaceline(true);
  };

  onTurnedCardDragEnd_ = () => {
    this.props.setDraggingToSpaceline(false);
  };
}

export default PlayerArea;
