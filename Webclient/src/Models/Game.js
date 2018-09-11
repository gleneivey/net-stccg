import Model from './Model';
import firebase from "../firebase";

class Game extends Model {
  constructor(playerId, playerName, gameData) {
    super();
    this.lastPlay = null;
    this.playerId = playerId;
    this.playerName = playerName;
    this.data = gameData;
    this.state = {};
  }

  isMyTurn() {
    return this.state.playerWhoseTurn === this.playerId;
  }

  iAmPlayerTwo() {
    return this.playerId !== this.data.playerOneId;
  }

  myOpponent() {
    return this.iAmPlayerTwo() ? this.data.playerOneId : this.data.playerTwoId;
  }

  advanceState(plays) {
    plays.forEach((play) => {
console.log("Game#advanceState");
console.log(play);

      this.initializeStateIfNecessary_();

      // any play can.....
      //     change whose turn it is
      if (Object.keys(play).includes("playerWhoseTurn")) {
        this.state.playerWhoseTurn = play.playerWhoseTurn;
      }
      //     change a card in play
      if (Object.keys(play).includes("setCardInPlay")) {
        this.state[play.setCardInPlay.for].cardInPlay = play.setCardInPlay.card;
      }
      //     adjust the content of decks
      if (Object.keys(play).includes("setDecks")) {
        const decksToSet = JSON.parse(JSON.stringify(play.setDecks));
        delete decksToSet.for;
        Object.keys(decksToSet).forEach((key) => {
          this.state[play.setDecks.for][key] = decksToSet[key];
        });
      }

      switch(play.type) {
        case "pass":
          // nothing but playerWhoseTurn key expected....
          break;
        case "setDecks":
          // nothing but setDecks key expected....
          break;
        case "turnCard":
          // nothing but setCardInPlay key expected....
          break;
        case "setLocations":
          this.state.locations = play.setLocations;
          break;
        default:
          console.log("Don't know how to process the 'play':");
          console.log(play);
      }

      this.lastPlay = play.id;
      if (play.advancePhaseTo) {
        this.state.phase = play.advancePhaseTo;
      }
console.log(JSON.stringify(this.state));
    });
  }

  static initializedGameData(userId, deck, gameId, opponentId) {
    const game = {
      id: gameId,
      playerOneId: userId,
      playerOneDeckId: deck.id,
      playerOneScore: 0,
      playerTwoId: opponentId,
      playerTwoDeckId: null,
      playerTwoScore: 0,
      started: firebase.firestore.Timestamp.now(),
      finished: null,
      winnerId: null,
      concessionId: null
    };

    game[userId] = {
      deck: deck
    };

    return game;
  };

  initializeStateIfNecessary_() {
    if (!this.state.phase) {
      this.state.phase = "initialization";
      this.state.locations = [];
      this.state.playerWhoseTurn = null;

      [this.data.playerOneId, this.data.playerTwoId].forEach((id) => {
        this.state[id] = {
          score: 0,
          cardInPlay: null
        };
      });
    }
  }
}

export default Game;
