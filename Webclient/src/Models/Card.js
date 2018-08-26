import Model from './Model';

class Card extends Model {
  constructor(cardData) {
    super();
    this.data = cardData;
  }

  isAMission() {
    return this.data.type === "mission";
  }

  shouldSeed() {
    return ["mission", "dilemma", "facility", "artifact"].includes(this.data.type);
  }

  doesTypeMatch(types) {
    return types.includes(this.data.type);
  }

  doesAffiliationIntersect(affiliations) {
    if (this.data.affiliation === null) {
      this.data.affiliation = "";
    }

    if (typeof this.data.affiliation === "string") {
      return affiliations.includes(this.data.affiliation);
    } else {
      if (this.data.affiliation.filter(a => affiliations.includes(a)).length > 0) {
        return true;
      }
    }
  }
}

export default Card;
