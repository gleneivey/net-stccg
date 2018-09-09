import React, { Component } from "react";
import PropTypes from "prop-types"
import classNames from "classnames";
import "./GameStatus.css";

class GameStatus extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
    opponent: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
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
          {turn} Turn
        </span>
      </div>
    </div>;
  }
}

export default GameStatus;