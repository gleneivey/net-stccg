import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom';
import './PlayGame.css';
import { firestore } from './firebase.js';
import Profile from './Profile';

class PlayGame extends Component {
  static propTypes = {
    userId: PropTypes.string,
    displayName: PropTypes.string,
    player: PropTypes.object,
    deck: PropTypes.object,
    opponent: PropTypes.object,
    currentGameId: PropTypes.string,
    doSignOut: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      opponentDeck: null,
      game: null
    };
  }

  componentDidMount() {
    this.fetchDocsIntoState_();
  }

  render() {
    if (!this.props.player || !this.props.opponent) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Profile
          displayName={this.props.player.displayName}
          doSignOut={this.props.doSignOut}
        />
        <h1 className="playGame__title">
          {this.props.player.displayName} ({this.props.deck.name}) <i>vs. </i>
          {this.props.opponent.displayName} ({this.state.opponentDeck && this.state.opponentDeck.name})
        </h1>
      </div>
    );
  }

  fetchDocsIntoState_ = () => {
    const self = this;
    const db = firestore();

    if (self.props.currentGameId) {
      const gameRef = db.collection("games").doc(self.props.currentGameId);
      const unsubscribe = gameRef
        .onSnapshot(function(snapshot) {
          const game = snapshot.data();
          game.id = self.props.currentGameId;
          const deckId = (game.playerOneId === self.props.opponent.id) ?
            game.playerOneDeckId : game.playerTwoDeckId;

          if (deckId) {
            unsubscribe();
            self.setState({game: game});

            db
              .collection("users")
              .doc(self.props.opponent.id)
              .collection("decks")
              .doc(deckId)
              .get()
              .then(function(snapshot) {
                const deck = snapshot.data();
                deck.id = deckId;
                self.setState({opponentDeck: deck});
              })
              .catch(function(error) {
                console.log("Error getting opponent's current 'deck' document: ", error);
              });
          }
        }, function(error) {
          console.log("Error getting doc from 'games': ", error);
        });
    }


  };
}

export default PlayGame;
