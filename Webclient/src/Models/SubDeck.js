
import Model from './Model';

class SubDeck extends Model {
  constructor(cardIds) {
    super();
    this.cardIds = cardIds;
  }

  canContainCard(cardId) {
    this.errorAbstractMethodCalled("canContainCart");
  }
}

export default SubDeck;
