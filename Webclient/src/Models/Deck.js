import Model from './Model';

class Deck extends Model {
  static ensureDeckDefaults(deck) {
    deck.mission = deck.mission || [];
    deck.seed = deck.seed || [];
    deck.draw = deck.draw || [];
  }

  static shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export default Deck;
