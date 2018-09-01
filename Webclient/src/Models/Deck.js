import Model from './Model';

class Deck extends Model {
  static ensureDeckDefaults(deck) {
    deck.mission = deck.mission || [];
    deck.seed = deck.seed || [];
    deck.draw = deck.draw || [];
  }

  static shuffle(a, name) {
    const shuffled = Array.from(a);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    if (a.length !== shuffled.length) {
      console.log(a);
      console.log(shuffled);
      throw new Error("card mismatch after shuffling '" + name + "'");
    }

    return shuffled;
  }
}

export default Deck;
