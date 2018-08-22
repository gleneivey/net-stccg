
import Model from './Model';

class SubDeck extends Model {
  canContainCart(card) {
    this.errorAbstractMethodCalled("canContainCart");
  }
}
