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

  basePlay(description, type) {
    return {
      precedingPlay: this.game.lastPlay,
      by: this.game.playerId,
      time: firebase.firestore.Timestamp.now(),
      description: description,
      type: type
    };
  }

  shuffleUp() {
    const play = Object.assign(this.basePlay(
      this.game.playerName + " shuffles their decks.",
      "setDecks"
    ), {
      setDecks: {
        for: this.game.playerId,
        id: this.game.data[this.game.playerId].deck.id,
        name: this.game.data[this.game.playerId].deck.name,
        hand: []
      }
    });

    let counter = 0;
    Object.keys(this.game.data[this.game.playerId].deck).forEach((deckName) => {
      if (["id", "name"].includes(deckName)) {    // not a deck....
        return;
      }
      const shuffledIds = Deck.shuffle(this.game.data[this.game.playerId].deck[deckName], deckName);
      const shuffledStructures = shuffledIds.map((id) => {
        return {
          id: id,
          by: this.game.playerId,
          index: counter++
        };
      });
      play.setDecks[deckName] = shuffledStructures;
    });

    if (this.game.lastPlay) {
      play.playerWhoseTurn = this.game.myOpponent();
      play.advancePhaseTo = "seed";
    }

    this.savePlay_(play);
  }

  turnCardFromDeck(deckName) {
    const card = this.game.state[this.game.playerId][deckName].shift();
    const updatedDeck = this.game.state[this.game.playerId][deckName];

    const setDecks = {
      for: this.game.playerId,
    };
    setDecks[deckName] = updatedDeck;

    const play = Object.assign(this.basePlay(
      this.game.playerName + " drew the card '" + card.name + "'",
      "turnCard"
    ), {
      setCardInPlay: {
        for: this.game.playerId,
        card: card
      },
      setDecks: setDecks
    });

    this.savePlay_(play);
  }

  updateLocations(spaceline, spacelineIndexOfNew) {
    let numEmptyPositions = 0;
    for (;!spaceline[numEmptyPositions].id && numEmptyPositions < spacelineIndexOfNew; numEmptyPositions++) {}

    let indexOfNew = spacelineIndexOfNew - numEmptyPositions;
    const locations = spaceline.filter(location => !!location.id);

    const play = Object.assign(this.basePlay(
      this.game.playerName + " plays Mission to Spaceline.",
      "setLocations"
    ), {
      setLocations: JSON.parse(JSON.stringify(locations)),
      indexOfChange: indexOfNew,
      playerWhoseTurn: this.game.myOpponent(),
      setDecks: {
        for: this.game.playerId,
        mission: this.game.state[this.game.playerId].mission
      }
    });

    this.savePlay_(play);
  }
}

export default PlayMaker;
