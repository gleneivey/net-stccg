import React, { Component } from "react";
import PropTypes from "prop-types"
import "./DeckEditor.css";
import "./DeckContent.css";
import SubDeckEditor from "./SubDeckEditor";
import DeckContentDelete from "./DeckContentDelete";
import { firestore } from "../../firebase";
import domTools from "../../domTools";


class DeckContent extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    deckId: PropTypes.string.isRequired,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired
  };

  /* Deck data structure is:
      {
        name: "string",
        mission: [],
        site: [],    // not yet supported
        seed: [],
        draw: []
      }
   */

  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      deckUnsubscribe: null,
      updateMissionSubdeck: updateFunctionFor_(this, 'mission'),
      updateSeedSubdeck: updateFunctionFor_(this, 'seed'),
      updateDrawSubdeck: updateFunctionFor_(this, 'draw'),
    };
  }

  componentDidMount() {
    this.fetchDocsIntoState_();
    domTools.fixupListHeight(this);
  }

  componentDidUpdate() {
    domTools.fixupListHeight(this);
  }

  render() {
    if (!this.state.deck) {
      return <div />;
    }

    return (
      <div className="deckContent__container" ref={el => (this.containerEl = el)}>
        <div className="deckContent__scrollable">
          <DeckContentDelete removeCardFromSubDeck={this.removeCardFromSubDeck_} />
          <h3>Seed-Phase Decks</h3>
          <SubDeckEditor
            type="mission"
            cardIds={this.state.deck.mission}
            min={6} max={6}
            updateCardIdsInSubDeck={this.state.updateMissionSubdeck}
            showDetailsFor={this.props.showDetailsFor}
            dontShowDetails={this.props.dontShowDetails}
          />
          <SubDeckEditor
            type="seed"
            cardIds={this.state.deck.seed}
            max={30}
            updateCardIdsInSubDeck={this.state.updateSeedSubdeck}
            showDetailsFor={this.props.showDetailsFor}
            dontShowDetails={this.props.dontShowDetails}
          />

          <DeckContentDelete removeCardFromSubDeck={this.removeCardFromSubDeck_} />
          <h3>Play-Phase Decks</h3>
          <SubDeckEditor
            type="draw"
            cardIds={this.state.deck.draw}
            min={30}
            updateCardIdsInSubDeck={this.state.updateDrawSubdeck}
            showDetailsFor={this.props.showDetailsFor}
            dontShowDetails={this.props.dontShowDetails}
          />
        </div>
      </div>
    );
  }

  fetchDocsIntoState_ = () => {
    const self = this;
    const db = firestore();

    const ref = db
      .collection("users")
      .doc(self.props.userId)
      .collection("decks")
      .doc(self.props.deckId);
    let unsubscribe = ref
      .onSnapshot(function(snapshot) {
        const deck = snapshot.data();
        deck.id = self.props.deckId;
        self.setState({deck: deck});
      }, function(error) {
        console.log("Error getting doc from 'games': ", error);
      });
    this.setState({deckUnsubscribe: unsubscribe});
  };

  removeCardFromSubDeck_ = (item) => {
    const subdeckName = item.fromSubdeck;
    let subdeck = this.state.deck[subdeckName];
    const toRemove = subdeck.indexOf(item.cardId);
    if (toRemove === -1) {
      console.log("WARNING!!!!  Couldn't find item to remove from SubDeckEditor", item);
      return;
    }

    subdeck.splice(toRemove, 1);
    updateSubDeckInDb_(this.props, subdeckName, subdeck);
  };
}

function updateFunctionFor_(instance, subdeck) {
  const fn = function (cardIds) {
    updateSubDeckInDb_(this.props, subdeck, cardIds);
  };

  return fn.bind(instance);
}

function updateSubDeckInDb_(props, subdeckName, subdeckCardIds) {
  let deckUpdate = {};
  deckUpdate[subdeckName] = subdeckCardIds;

  const db = firestore();
  db
    .collection("users")
    .doc(props.userId)
    .collection("decks")
    .doc(props.deckId)
    .update(deckUpdate);
}


export default DeckContent;
