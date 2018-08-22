
import MissionSubDeck from './MissionSubDeck';

const constructors = {
  "mission": MissionSubDeck
};

function subDeckFactory(key, cardIds) {
  if (constructors[key]) {
    return Reflect.construct(constructors[key], cardIds);
  } else {
    return { canContainCard: () => true }
  }
}

export default subDeckFactory;
