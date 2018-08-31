import Model from './Model';
import Deck from "./Deck";
import {firestore} from "../firebase";
import firebase from "../firebase";

class PlayMaker extends Model {
  constructor(game) {
    super();
    this.game = game;
  }

  savePlay_(play) {
console.log("savePlay_");
console.log(play);
    const db = firestore();
    db
      .collection("games")
      .doc(this.game.data.id)
      .collection("plays")
      .add(play);
  }

  shuffleUp() {
    const play = {
      precedingPlay: this.game.lastPlay,
      by: this.game.playerId,
      time: firebase.firestore.Timestamp.now(),
      description: this.game.playerName + " shuffles their decks.",
      type: "setDecks",
      setDecks: JSON.parse(JSON.stringify(this.game.data[this.game.playerId].deck))
    };

    play.setDecks.for = this.game.playerId;
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

    if (this.game.lastPlay) {
      play.advancePhaseTo = "seed";
    }

    this.savePlay_(play);
  }

  updateLocations(spaceline, spacelineIndexOfNew) {
    let numEmptyPositions = 0;
    for (;!spaceline[numEmptyPositions].cardId && numEmptyPositions < spacelineIndexOfNew; numEmptyPositions++) {}

    let indexOfNew = spacelineIndexOfNew - numEmptyPositions;
    const locations = spaceline.filter(location => !!location.cardId);

    const play = {
      precedingPlay: this.game.lastPlay,
      by: this.game.playerId,
      time: firebase.firestore.Timestamp.now(),
      description: this.game.playerName + " plays Mission to Spaceline.",
      type: "setLocations",
      setLocations: JSON.parse(JSON.stringify(locations)),
      indexOfChange: indexOfNew,
      setDecks: {
        for: this.game.playerId,
        mission: this.game.state[this.game.playerId].mission
      }
    };

    this.savePlay_(play);
  }
}

export default PlayMaker;
