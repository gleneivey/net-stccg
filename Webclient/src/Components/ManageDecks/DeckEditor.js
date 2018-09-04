import React, { Component } from "react";
import PropTypes from "prop-types"
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./DeckEditor.css";
import AvailableCards from "./AvailableCards";
import DeckContent from "./DeckContent";
import CardHoverDetail from "../CardHoverDetail";

class DeckEditor extends Component {
  static propTypes = {
    showDebug: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
    deck: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetailsFor: null
    };
  }

  render() {
    if (!this.props.deck) {
      return <div />;
    }

    return (
      <div>
        <CardHoverDetail
          showDebug={this.props.showDebug}
          cardId={this.state.showDetailsFor}
        />
        <h2 className="deck__name">{this.props.deck.name}</h2>
        <DeckContent
          userId={this.props.userId}
          deckId={this.props.deck.id}
          showDetailsFor={this.showDetailsFor_}
          dontShowDetails={this.dontShowDetails_}
        />
        <AvailableCards
          showDetailsFor={this.showDetailsFor_}
          dontShowDetails={this.dontShowDetails_}
        />
      </div>
    );
  }

  showDetailsFor_ = (cardId) => {
    this.setState({showDetailsFor: cardId});
  };

  dontShowDetails_ = () => {
    this.setState({showDetailsFor: null});
  };
}

export default DragDropContext(HTML5Backend)(DeckEditor);
