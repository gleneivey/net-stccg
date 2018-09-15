
const cardSetNames = {
  "1e-p": "Premiere",
  "1e-au": "Alternate Universe",
  "1e-q": "Q Continuum",
  "1e-i2p": "Introductory 2-Player Game",
  "1e-1a": "First Anthology",
  "1e-fc": "First Contact",
  "1e-fajo": "Fajo Collection",
  "1e-at": "Away Team Pack",
  "1e-tsd": "Official Tournament Sealed Deck",
  "1e-ds9": "Deep Space 9",
  "1e-s2": "Starter Deck II",
  "1e-efc": "Enhanced First Contact",
  "1e-d": "The Dominion",
  "1e-bog": "Blaze of Glory",
  "1e-roa": "Rules of Acquisition",
  "1e-a": "Armada",
  "1e-2a": "Second Anthology",
  "1e-twt": "The Trouble with Tribbles",
  "1e-tst2": "The Trouble with Tribbles Starter Decks",
  "1e-r": "Reflections",
  "1e-ep": "Enhanced Premiere",
  "1e-mm": "Mirror, Mirror",
  "1e-v": "Voyager",
  "1e-b": "The Borg",
  "1e-ha": "Holodeck Adventures",
  "1e-p2e": "Promo Cards",
  "1e-tmp": "The Motion Pictures"
};

const deckNames = {
  "mission": "Mission Deck",
  "seed": "Seed Deck",
  "draw": "Draw Deck"
};
/*
"Site"
"Q-Tent Side Deck"
"Q-Flash Side Deck"
"Battle-Bridge Side Deck"
"Storage Compartment Side Deck"
"Q the Referee Side Deck"
"Dilemma Side Deck"
"&quot;outside the game&quot;"
*/

const cardTypes = {
  "person": "Personnel",
  "ship": "Ship",
  "mission": "Mission",
  "dilemma": "Dilemma",
  "facility": "Facility",
  "artifact": "Artifact",
  "equipment": "Equipment",
  "event": "Event",
  "interrupt": "Interrupt",
};
/*
"DamageMarker": "Damage Marker",
"Doorway": "Doorway",
"Incident": "Incident",
"InterruptEvent": "Interrupt/Event",
"Objective": "Objective",
"QArtifact": "Q Artifact",
"QDilemma": "Q Dilemma",
"QDilemmaEvent": "Q Dilemma/Event",
"QEvent": "Q Event",
"QInterrupt": "Q Interrupt",
"QMission": "Q Mission",
"Site": "Site",
"Tactic": "Tactic",
"TimeLocation": "Time Location",
"Tribble": "Tribble",
"Trouble": "Trouble",
*/

const cardAffiliations = {
  "": "unaligned",
  "Fed": "Federation",
  "Kli": "Klingon",
  "Non": "Neutral",
  "Rom": "Romulan"
};
/*
"Bajoran"
"Borg"
"Cardassian"
"Dominion"
"Ferengi"
"Hirogen"
"Kazon"
"Non_Aligned"
"Starfleet"
"Vidiian"
"Vulcan"
 */

const genericCardRarities = [
  "C", "U", "R"
];

const deckPregen = {
  "1e-p": "Premiere Starter Deck plus Warp Pack (random)",
  "1e-i2p f": "Intro 2-Player Game, Federation Deck",
  "1e-i2p k": "Intro 2-Player Game, Klingon Deck",
};

const gameStates = [
  {
    key: "initialization",
    name: ""
  },
  {
    key: "seed",
    name: "Seeding",
    gameStates: [
      // {
      //   key: "doorway",
      //   name: "Doorway Phase",
      // },
      {
        key: "mission",
        name: "Mission Phase",
      },
      {
        key: "dilemma",
        name: "Dilemma Phase",
      },
      {
        key: "facility",
        name: "Facility Phase",
      }
    ]
  },
  {
    key: "play",
    name: "Play Phase"
  },
  {
    key: "end",
    name: "End of Game"
  }
];

const turnStates = [
  {
    key: "normal",
    name: "Play a Card"
  },
  {
    key: "orders",
    name: "Execute Orders",
    alternatives: [
      "Moving personel and/or equipment",
      "Moving ship",
      "Attempting Mission",
      "Commandeer a Facility",
      "Personel Battle",
      "Ship Battle"
    ]
  },
  {
    key: "draw",
    name: "Draw a Card"
  }
];

export default {
  screen: function screen(knownGood, toScreen) {
    const bad = toScreen.some((item) => !knownGood.includes(item));
    return bad ? null : toScreen;
  },

  cardSetNames: cardSetNames,
  deckNames: deckNames,
  cardTypes: cardTypes,
  cardAffiliations: cardAffiliations,
  genericCardRarities: genericCardRarities,
  deckPregen: deckPregen,
  stateCollections: {
    gameStates: gameStates,
    turnStates: turnStates
  },
};
