import MissionSubDeck from './MissionSubDeck';
import SeedSubDeck from './SeedSubDeck';
import DrawSubDeck from './DrawSubDeck';

const constructors = {
  "mission": MissionSubDeck,
  "seed": SeedSubDeck,
  "draw": DrawSubDeck,
};

function subDeckFactory(key, cardIds) {
  if (constructors[key]) {
    return Reflect.construct(constructors[key], cardIds);
  } else {
    return { canContainCard: () => true }
  }
}

export default subDeckFactory;
