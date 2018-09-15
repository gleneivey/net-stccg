import React, { Component } from "react";
import PropTypes from "prop-types"
import classNames from "classnames";
import "./GameStatus.css";
import metadata from "../../CardData/metadata";

class GameStatus extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
    opponent: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    plays: PropTypes.array.isRequired,
    flashTurnStatus: PropTypes.bool.isRequired
  };

  render() {
    const gameData = this.props.game.data;
    const myId = this.props.player.id;
    const myName = this.props.player.displayName;
    const theirId = this.props.opponent.id;
    const theirName = this.props.opponent.displayName;
    const myDeck = gameData[myId] && gameData[myId].deck;
    const theirDeck = gameData[theirId] && gameData[theirId].deck;

    if (!this.props.game.state[myId] || !this.props.game.state[theirId]) {
      return <div />;
    }

    const turn = myId === this.props.game.state.playerWhoseTurn ? "Your" : "Their";
    const turnStatusClasses = classNames({
      "gameStatus__turnStatus": true,
      "gameStatus__turnStatus--flash": this.props.flashTurnStatus
    });

    return <div className="gameStatus__container">
      <h1 className="gameStatus__scoreAndDeck">
        {this.props.game.state[myId].score} points &mdash; {myName} ({myDeck && myDeck.name})
      </h1>
      <h1 className="gameStatus__scoreAndDeck">
        {this.props.game.state[theirId].score} points &mdash; {theirName} ({theirDeck && theirDeck.name})
      </h1>
      <div className="gameStatus__hoveringContainer">
        <span className={turnStatusClasses}>
          <span className="gameStatus__turnStatusMarker">&raquo;</span> {turn} Turn
        </span>
      </div>

      <div className="gameStatus__phase">
        Now: {this.phaseDisplayString_(this.props.game.state.phase)}
      </div>
      <div className="gameStatus__lastPlay">
        Last: {this.props.plays[this.props.plays.length-1].description}
      </div>
    </div>;
  }

  phaseDisplayString_ = (phaseString) => {
    let resultString = "";
    let gameStates = metadata.stateCollections.gameStates;

    phaseString.split(":").forEach(function (key) {
      if (resultString.length > 0) { resultString += " - "; }

      const stateInfo = gameStates.find(function (info) { return info.key === key; });
      if (stateInfo) {
        resultString += stateInfo.name;
        gameStates = stateInfo.gameStates;
      } else {
        resultString += key;
      }
    });

    return resultString;
  };
}

export default GameStatus;
