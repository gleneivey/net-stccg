import DeckGenerator from './DeckGenerator';
import cardFactory from "./cardFactory";

import cardData from "../CardData/data"
const { cardMap } = cardData;

class FromListGenerator extends DeckGenerator {
  generate() {
    let list;
    if (this.listKey) {
      list = this.listObject[this.listKey];
    } else {
      list = this.listObject;
    }

    let newDeck = {
      mission: [],
      seed: [],
      draw: []
    };

    list.forEach((cardId) => {
      const cardData = cardMap[cardId];
      if (!cardData) { return; }

      const card = cardFactory(cardData);
      if (card.isAMission()) {
        newDeck.mission.push(cardId);
      } else if (card.shouldSeed()) {
        newDeck.seed.push(cardId);
      } else {
        newDeck.draw.push(cardId);
      }
    });

    return newDeck;
  }
}

export default FromListGenerator;
