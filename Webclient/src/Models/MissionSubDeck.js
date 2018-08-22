
import SubDeck from './SubDeck';
import metadata from '../CardData/metadata';
import cardData from "../CardData/data"
const { cardMap } = cardData;

const acceptableCardTypes = metadata.screen(
  Object.keys(metadata.cardTypes),
  ["mission"]
);

console.log("acceptableCardTypes");
console.log(acceptableCardTypes);

class MissionSubDeck extends SubDeck {
  canContainCard(cardId) {
    const card = cardMap[cardId];
console.log(card);
console.log(card.type);
    return acceptableCardTypes.includes(card.type);
  }
}

export default MissionSubDeck;
