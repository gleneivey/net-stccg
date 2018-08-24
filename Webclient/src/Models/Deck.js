import Model from './Model';

class Deck extends Model {
  static ensureDeckDefaults(deck) {
    deck.mission = deck.mission || [];
    deck.seed = deck.seed || [];
    deck.draw = deck.draw || [];
  }
}

export default Deck;
