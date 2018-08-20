import metadata from './metadata';
import premier from './premier';

const cards = premier;
const cardMap = {};
cards.forEach((card) => { cardMap[card.id] = card; });

const data = {
  metadata: metadata,
  cards: cards,
  cardMap: cardMap
};

export default data;
