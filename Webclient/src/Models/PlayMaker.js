import Model from './Model';
import Deck from "./Deck";
import {firestore} from "../firebase";
import firebase from "../firebase";
import metadata from "../CardData/metadata";

import cardData from "../CardData/data";
const { cardMap } = cardData;

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
      this.game.playerName + " shuffled their decks.",
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
      const seedInfo = metadata.stateCollections.gameStates.find(function (info) { return info.key === "seed"; });
      play.advancePhaseTo = "seed:" + seedInfo.gameStates[0].key;
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

    const cardData = cardMap[card.id];
    const play = Object.assign(this.basePlay(
      this.game.playerName + " drew the card '" + cardData.name + "'",
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
    const newCard = spaceline[spacelineIndexOfNew];
    let numEmptyPositions = 0;
    for (;!spaceline[numEmptyPositions].id && numEmptyPositions < spacelineIndexOfNew; numEmptyPositions++) {}

    let indexOfNew = spacelineIndexOfNew - numEmptyPositions;
    const locations = spaceline.filter(location => !!location.id);
    const myMissionDeck = this.game.state[this.game.playerId].mission;
    const opponent = this.game.myOpponent();

    const cardData = cardMap[newCard.id];
    const play = Object.assign(this.basePlay(
      this.game.playerName + " played the Mission '" + cardData.name + "' to the Spaceline.",
      "setLocations"
    ), {
      setLocations: JSON.parse(JSON.stringify(locations)),
      indexOfChange: indexOfNew,
      playerWhoseTurn: opponent,
      setCardInPlay: {
        for: this.game.playerId,
        card: null
      },
      setDecks: {
        for: this.game.playerId,
        mission: myMissionDeck
      }
    });

    if (myMissionDeck.length === 0 &&
      this.game.state[opponent].mission.length === 0) {
      play.advancePhaseTo = "seed:dilemma";
    }

    this.savePlay_(play);
  }
}

export default PlayMaker;
