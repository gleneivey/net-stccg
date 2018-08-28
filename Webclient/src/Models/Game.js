import Model from './Model';
import {firestore} from "../firebase";
import Deck from "./Deck";
import firebase from "../firebase";

class Game extends Model {
  constructor(playerId, gameData) {
    super();
    this.playerId = playerId;
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
        for (let c = 0; c < 13; c++) {
          this.state.locations.push({});
        }
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
        default:
          console.log("Don't know how to process the 'play':");
          console.log(play);
      }

      // switch (this.state.phase) {
      //   case "initialization":
      //
      //     break;
      // }

      this.state.lastPlay = play.id;
      if (play.advancePhaseTo) {
        this.state.phase = play.advancePhaseTo;
      }
console.log(this.state);
    });
  }

  // this method is expected to be bound to a React component to call
  static shuffleUp(gameData, precedingPlay) {
    const play = {
      precedingPlay: precedingPlay,
      by: this.props.userId,
      time: firebase.firestore.Timestamp.now(),
      description: this.props.displayName + " shuffles their decks.",
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

    if (precedingPlay) {
      play.advancePhaseTo = "seed";
    }
console.log(play);
    const db = firestore();
    db
      .collection("games")
      .doc(gameData.id)
      .collection("plays")
      .add(play);
  }
}

export default Game;
