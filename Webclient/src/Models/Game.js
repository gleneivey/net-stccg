import Model from './Model';
import {firestore} from "../firebase";
import Deck from "./Deck";
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

  advanceState(plays) {
    plays.forEach((play) => {
console.log("Game#advanceState");
console.log(play);

      if (!this.state.phase) {
        this.state.phase = "initialization";
        this.state.locations = [];
      }

      switch(play.type) {
        case "setDecks":
          const decksToSet = JSON.parse(JSON.stringify(play.setDecks));
          delete decksToSet.for;
          Object.keys(decksToSet).forEach((key) => {
            this.state[play.setDecks.for] = this.state[play.setDecks.for] || {};
            this.state[play.setDecks.for][key] = decksToSet[key];
          });
          break;
        case "setLocations":
          this.state.locations = play.setLocations;
          break;
        default:
          console.log("Don't know how to process the 'play':");
          console.log(play);
      }

      // switch (this.state.phase) {
      //   case "initialization":
      //
      //     break;
      // }

      this.lastPlay = play.id;
      if (play.advancePhaseTo) {
        this.state.phase = play.advancePhaseTo;
      }
console.log(this.state);
    });
  }

  // this method is expected to be bound to a React component to call
  static shuffleUp() {
    const game = this.props.game || this.state.game;

    const play = {
      precedingPlay: game.lastPlay,
      by: game.playerId,
      time: firebase.firestore.Timestamp.now(),
      description: game.playerName + " shuffles their decks.",
      type: "setDecks",
      setDecks: JSON.parse(JSON.stringify(this.props.deck))
    };

    play.setDecks.for = this.props.userId;
    play.setDecks.hand = [];

    const shuffledMission = Deck.shuffle(play.setDecks.mission);
    if (shuffledMission.length !== play.setDecks.mission.length) {
      console.log(shuffledMission);
      console.log(play.setDecks.mission);
      throw new Error("missions lost during shuffle");
    }
    play.setDecks.mission = shuffledMission;

    const shuffledDraw = Deck.shuffle(play.setDecks.draw);
    if (shuffledDraw.length !== play.setDecks.draw.length) {
      console.log(shuffledMission);
      console.log(play.setDecks.draw);
      throw new Error("draw-deck cards lost during shuffle");
    }
    play.setDecks.draw = shuffledDraw;

    if (game.lastPlay) {
      play.advancePhaseTo = "seed";
    }

console.log(play);
    const db = firestore();
    db
      .collection("games")
      .doc(game.data.id)
      .collection("plays")
      .add(play);
  }

  static updateLocations(spaceline, spacelineIndexOfNew) {
    const game = this.props.game || this.state.game;

    let numEmptyPositions = 0;
    for (;!spaceline[numEmptyPositions].cardId && numEmptyPositions < spacelineIndexOfNew; numEmptyPositions++) {}

    let indexOfNew = spacelineIndexOfNew - numEmptyPositions;
    const locations = spaceline.filter(location => !!location.cardId);

    const play = {
      precedingPlay: game.lastPlay,
      by: game.playerId,
      time: firebase.firestore.Timestamp.now(),
      description: game.playerName + " plays Mission to Spaceline.",
      type: "setLocations",
      setLocations: JSON.parse(JSON.stringify(locations)),
      indexOfChange: indexOfNew
    };

console.log(play);
    const db = firestore();
    db
      .collection("games")
      .doc(game.data.id)
      .collection("plays")
      .add(play);
  }
}

export default Game;
