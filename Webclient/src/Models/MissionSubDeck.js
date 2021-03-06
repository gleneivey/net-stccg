import SubDeck from './SubDeck';
import metadata from '../CardData/metadata';
import cardData from "../CardData/data"
const { cardMap } = cardData;

const acceptableCardTypes = metadata.screen(
  Object.keys(metadata.cardTypes),
  ["mission"]
);


class MissionSubDeck extends SubDeck {
  canContainCard(cardId) {
    const card = cardMap[cardId];
    return acceptableCardTypes.includes(card.type) &&
      (card.multiple || !this.cardIds.includes(cardId));
  }
}

export default MissionSubDeck;
