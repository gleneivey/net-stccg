import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Deck.css';

class Deck extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    deck: PropTypes.object
  };

  render() {
    if (!this.props.deck) {
      return <div />;
    }

    return (
      <div>
        <h2 className="deck__name">{this.props.deck.name}</h2>
      </div>
    );
  }
}

export default Deck;
