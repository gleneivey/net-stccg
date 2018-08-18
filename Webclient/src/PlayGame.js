import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom';
import './PlayGame.css';
import firebase, { firestore } from './firebase.js';
import Profile from './Profile';
import badgeIconCommand from './badge-icon-command.svg'

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
      width: window.innerWidth,
      height: window.innerHeight,
      opponentConceded: false,
      opponentDeck: null,
      game: null,
      plays: [],
      playsMap: {},
      gameCollectionUnsubscribe: null,
      playCollectionUnsubscribe: null
    };
  }

  componentDidMount() {
    this.fetchDocsIntoState_();
  }

  render() {
    if (!this.props.player || !this.props.opponent) {
      return <Redirect to="/" />;
    }

    let maybeScrim = null;
    if (this.state.opponentConceded) {
      maybeScrim = (
        <div className="pageModal__scrim">
          <div className="pageModal__message">
            <p>
              Your opponent has conceded!  This match will be recorded in
              your favor.
            </p>
            <Link to="/" className="pageModal_link">
              <img src={badgeIconCommand} className="playGame__backArrow" alt="" />
              Return to Your Decks
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="playGame__playmat" onClick={this.onPlayClick_}>
        </div>
        {maybeScrim}
        <Profile
          displayName={this.props.player.displayName}
          doSignOut={this.props.doSignOut}
        />
        <Link className="playGame__concede" to="/" onClick={this.onConcede_}>
          <img src={badgeIconCommand} className="playGame__backArrow" alt="" />
          Concede Game
        </Link>
        <h1 className="playGame__title">
          {this.props.player.displayName} ({this.props.deck.name}) <i>vs. </i>
          {this.props.opponent.displayName} ({this.state.opponentDeck && this.state.opponentDeck.name})
        </h1>

        {this.state.plays.map(play => (
          <div
            className="playGame__dot"
            key={play.id}
            style={{
              backgroundColor: (play.by === this.props.userId ? "#0000ff" : "#ff0000"),
              left: (Math.floor(play.x * this.state.width) - 10) + "px",
              top: (Math.floor(play.y * this.state.height) - 10) + "px"
            }}
          >
            &nbsp;
          </div>
        ))}
      </div>
    );
  }

  fetchDocsIntoState_ = () => {
    if (!this.props.currentGameId) {
      return;
    }

    const self = this;
    const db = firestore();

    const gameRef = db.collection("games").doc(self.props.currentGameId);
    let unsubscribe = gameRef
      .onSnapshot(function(snapshot) {
        const game = snapshot.data();
        game.id = self.props.currentGameId;

        if (!self.state.opponentDeck) {
          self.tryToLoadOpponentDeck_(game);
        }
        if (game.concessionId) {
          self.handleOpponentConceded_();
        }
      }, function(error) {
        console.log("Error getting doc from 'games': ", error);
      });
    this.setState({gameCollectionUnsubscribe: unsubscribe});

    const playRef = db.collection("games").doc(self.props.currentGameId).collection("plays");
    unsubscribe = playRef
      .onSnapshot(function(snapshots) {
        self.handlePlaySnapshots_(snapshots);
      }, function(error) {
        console.log("Error getting docs from 'plays': ", error);
      });
    this.setState({playCollectionUnsubscribe: unsubscribe});
  };

  handlePlaySnapshots_ = (snapshots) => {
    let plays = this.state.plays;
    const playsMap = this.state.playsMap;
    const newPlays = [];

    snapshots.forEach((snapshot) => {
      const play = snapshot.data();
      const id = snapshot.id;

      if (!playsMap[id]) {
        play.id = id;
        playsMap[id] = play;
        newPlays.push(play);
      }
    });

    if (newPlays.length < 1) {
      return;
    }

    plays = plays.concat(newPlays.sort((a,b) => {
      const secondsDifferent = a.time.seconds - b.time.seconds;
      return secondsDifferent ? secondsDifferent : (a.time.nanoseconds - b.time.nanoseconds);
    }));

    this.setState({
      plays: plays,
      playsMap: playsMap
    })
  };

  tryToLoadOpponentDeck_ = (game) => {
    const self = this;
    const db = firestore();
    const deckId = (game.playerOneId === self.props.opponent.id) ?
      game.playerOneDeckId : game.playerTwoDeckId;

    if (deckId) {
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
  };

  cleanUp_ = () => {
    let unsubscribe = this.state.gameCollectionUnsubscribe;
    if (unsubscribe) {
      unsubscribe();
    }
  };

  onConcede_ = () => {
console.log("hope we go through here before we navigate/re-render");
    this.cleanUp_();

    const db = firestore();
    db
      .collection("games")
      .doc(this.state.game.id)
      .update({
        finished: firebase.firestore.Timestamp.now(),
        concessionId: this.props.userId
      })
  };

  handleOpponentConceded_ = () => {
    this.cleanUp_();
    this.setState({opponentConceded: true});
  };

  onPlayClick_ = (event) => {
    const x = event.pageX / this.state.width;
    const y = event.pageY / this.state.height;

    const db = firestore();
    db
      .collection("games")
      .doc(this.state.game.id)
      .collection("plays")
      .add({
        x: x,
        y: y,
        by: this.props.userId,
        time: firebase.firestore.Timestamp.now()
      })
  };
}

export default PlayGame;
