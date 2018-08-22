
import SubDeck from './SubDeck';

class MissionSubDeck extends SubDeck {
  canContainCart(card) {
    this.errorAbstractMethodCalled("canContainCart");
  }
}
