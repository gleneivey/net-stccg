import metadata from './metadata';
import premier from './premier';

function corrupt(field, card) {
  const message = "Corrupt/inconsistent card database.  Bad value in OR missing '" + field +
    "' field in the card structure:  ";
  console.log(message);
  console.log(card);
  window.alert("Corrupt/inconsistent card database.  System will not function.  (Check console to debug.)");
  throw new Error(message + card);
}

function shouldBeNonemptyString(field, card) {
  if (typeof card[field] !== "string" || card[field].length === 0) {
    corrupt(field, card);
  }
}

function shouldBeInteger(value, field, card) {
  if (!(/^\d+$/.test(value))) {
    corrupt(field, card);
  }
}

function shouldHaveBooleanField(field, card) {
  if (typeof card[field] !== "boolean") {
    corrupt(field, card);
  }
}

// do once outside of loop
const cardTypeKeys = Object.keys(metadata.cardTypes);
const cardSetNameKeys = Object.keys(metadata.cardSetNames);
const cardAffiliationKeys = Object.keys(metadata.cardAffiliations);

const cards = premier;
const cardMap = {};
cards.forEach((card) => {
  // error check card data against metadata

  //   "type":"person"
  if (!cardTypeKeys.includes(card.type)) {
    corrupt("type", card);
  }

  //   "id":"1e-p|1555"
  const separatedId = card.id.split("|");
  if (!cardSetNameKeys.includes(separatedId[0])) {
    corrupt("id", card);
  }
  shouldBeInteger(separatedId[1], "id", card);

  //   "imageUrl":"http://trekcc.org/1e/cardimages/premiere/koroth.gif"
  shouldBeNonemptyString("imageUrl", card);

  //   "name":"Koroth"
  shouldBeNonemptyString("name", card);

  //   "multiple":false
  shouldHaveBooleanField("multiple", card);

  //   "affiliation":"Kli"
  if (typeof card.affiliation === "string") {
    if (!cardAffiliationKeys.includes(card.affiliation)) {
      corrupt("affiliation", card);
    }
  } else if (card.affiliation === null) {
    if (!["dilemma", "facility"].includes(card.type)) {
      corrupt("affiliation", card);
    }
  } else {
    card.affiliation.forEach((affil) => {
      const titelized = affil.substr(0,1) + affil.substr(1).toLowerCase();
      if (!cardAffiliationKeys.includes(titelized)) {
        corrupt("affiliation", card);
      }
    });
  }

  //   "rarity":"U (Premiere)"
  let match = card.rarity.match(/^([A-Z]+) /);
  if (!metadata.genericCardRarities.includes(match[1])) {
    corrupt("rarity", card);
  }

  //   "block":"SCIENCE"
  if (!["equipment", "mission", "dilemma", "interrupt", "event", "artifact", "facility"].includes(card.type)) {
    shouldBeNonemptyString("block", card);
  }

  //   "details":
  //     {"integrity":"8","cunning":"6","strength":"6"}
  if (card.type === "person") {
    shouldBeInteger(card.details.integrity, "details:integrity", card);
    shouldBeInteger(card.details.cunning, "details:cunning", card);
    shouldBeInteger(card.details.strength, "details:strength", card);
  }

  //   "text":"Klingon....."
  //   "rules":""
  //   "attributes":["Biology","Archaeology","Anthropology"]
  //   "characteristics":["Klingon","Male"]


  // all's well, add card to map
  cardMap[card.id] = card;
});

const data = {
  metadata: metadata,
  cards: cards,
  cardMap: cardMap
};

export default data;
