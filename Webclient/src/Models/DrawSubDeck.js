import SubDeck from './SubDeck';
import metadata from '../CardData/metadata';
import cardData from "../CardData/data"
const { cardMap } = cardData;

const cardTypeKeys = Object.keys(metadata.cardTypes);  // drop out Q-Icon cards when we get there
const acceptableCardTypes = metadata.screen(
  Object.keys(metadata.cardTypes),
  cardTypeKeys
);


class DrawSubDeck extends SubDeck {
  canContainCard(cardId) {
    const card = cardMap[cardId];
    return acceptableCardTypes.includes(card.type);
  }
}

export default DrawSubDeck;
