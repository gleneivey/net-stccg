import React, { Component } from "react";
import PropTypes from "prop-types"
import "./DeckSelector.css";
import { firestore } from "../../firebase.js";
import deckGeneratorFactory from "../../Models/deckGeneratorFactory";
import metadata from "../../CardData/metadata"


class DeckSelector extends Component {
  static propTypes = {
    decks: PropTypes.array.isRequired,
    currentDeckIndex: PropTypes.number,
    userId: PropTypes.string.isRequired,
    addingADeck: PropTypes.bool.isRequired,
    updateAddingADeck: PropTypes.func.isRequired,
    onDeckAdded: PropTypes.func.isRequired,
    doDeckSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      addDeck: "blank",
      deckToGenerate: "",
      newDeckName: ""
    };
  }

  render() {
    return (
      <div>
        { this.props.addingADeck ? (
          <div className="deckSelector__add">
            <label className="deckSelector__newNameLabel">Name for new deck:</label>
            <input
              type="text"
              value={this.state.newDeckName}
              onChange={this.updateNewDeckName_}
            />
            <button
              className="button"
              onClick={this.addDeck_}
            >Save Deck</button>
            <a className="deckSelector__cancel" onClick={this.changeToSelecting_}>cancel</a>

            <div className="deckGenerate__container">
              <label className="deckGenerate__generateRadio">
                <input
                  type="radio" name="generate" value="blank"
                  onChange={this.generateChanged_}
                  checked={this.state.addDeck === "blank"}
                />
                New blank deck.
              </label>
              <label className="deckGenerate__generateRadio">
                <input
                  type="radio" name="generate" value="generate"
                  onChange={this.generateChanged_}
                  checked={this.state.addDeck === "generate"}
                />
                Generate a deck:
              </label>

              <div className="deckGenerate__options">
                {Object.keys(metadata.deckPregen).map(key => (
                  <label className="deckGenerate__option" key={key}>
                    <input
                      type="radio" name="option" value={key}
                      checked={this.state.deckToGenerate === key}
                      onChange={this.optionChanged_}
                      disabled={this.state.addDeck === "blank"}
                    />
                    {metadata.deckPregen[key]}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="deckSelector__selection">
            {this.selectorOrEmptyMessage_()}
            <button
              className="button"
              onClick={this.changeToAdding_}
            >Add Deck</button>
          </div>
        )}
      </div>
    );
  }

  selectorOrEmptyMessage_ = () => {
    if (this.props.decks.length > 0) {
      if (!this.props.decks[this.props.currentDeckIndex]) {
        return <div />;
      }
      return (
        <div>
          <label>Choose a Deck:</label>
          <select
            value={this.props.decks[this.props.currentDeckIndex].id}
            onChange={this.selectionChanged_}
          >
            {this.props.decks.map(deck => (
              <option
                key={deck.id}
                value={deck.id}
              >
                {deck.name}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      return (
        <div className="deckSelector__placeholderText">You'll have to add a deck to proceed.</div>
      );
    }
  };

  changeToAdding_ = () => {
    this.props.updateAddingADeck(true);
  };

  changeToSelecting_ = () => {
    this.setState({newDeckName: ''});
    this.props.updateAddingADeck(false);
  };

  updateNewDeckName_ = (event) => {
    this.setState({newDeckName: event.target.value});
  };

  addDeck_ = () => {
    const self = this;
    const db = firestore();
    let newDeckInfo;
    if (this.state.addDeck === "blank") {
      newDeckInfo = {
        mission: [],
        site: [],
        seed: [],
        draw: []
      };
    } else {
      const generator = deckGeneratorFactory(this.state.deckToGenerate);
      newDeckInfo = generator.generate();
    }


    newDeckInfo.name = self.state.newDeckName;

    db
      .collection('users')
      .doc(self.props.userId)
      .collection('decks')
      .add(newDeckInfo)
      .then(function(docRef) {
        self.setState({newDeckName: ''});
        self.props.updateAddingADeck(false);
        self.props.onDeckAdded(docRef.id);
      })
      .catch(function(error) {
        console.log("Error writing new 'user' document: ", error);
      });
  };

  selectionChanged_ = (event) => {
    this.props.doDeckSelect(event.target.value);
  };

  generateChanged_ = (event) => {
    const addDeck = event.target.value;
    const deckToGenerate = (addDeck === "blank") ? "" : this.state.deckToGenerate;
    this.setState({
      addDeck: addDeck,
      deckToGenerate: deckToGenerate
    })
  };

  optionChanged_ = (event) => {
    this.setState({deckToGenerate: event.target.value})
  };
}

export default DeckSelector;
