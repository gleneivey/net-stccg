import PremierStarterGenerator from './PremierStarterGenerator';
import FromListGenerator from './FromListGenerator';

import intro2PlayerLists from '../CardData/intro2PlayerLists';


const constructors = {
  "1e-p": {
    constructor: PremierStarterGenerator,
    params: []
  },
  "1e-i2p f": {
    constructor: FromListGenerator,
    params: [intro2PlayerLists, "federationList"]
  },
  "1e-i2p k": {
    constructor: FromListGenerator,
    params: [intro2PlayerLists, "klingonList"]
  },
};

function deckGeneratorFactory(key) {
  if (constructors[key]) {
    const constructor = constructors[key].constructor;
    return Reflect.construct(constructor, constructors[key].params);
  } else {
    throw new Error("Internal error -- can't construct a deck generator for '" + key + "'");
  }
}

export default deckGeneratorFactory;
