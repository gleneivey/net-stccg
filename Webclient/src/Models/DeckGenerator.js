import Model from './Model';

class DeckGenerator extends Model {
  constructor(listObject, listKey) {
    super();
    this.listObject = listObject;
    this.listKey = listKey;
  }

  generate() {
    this.errorAbstractMethodCalled("canContainCart");
  }
}

export default DeckGenerator;
