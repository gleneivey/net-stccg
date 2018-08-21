import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom';
import './StartGame.css';
import firebase, { firestore } from './firebase.js';
import Profile from './Profile';
import badgeIconCommand from './Assets/badge-icon-command.svg'
import spinner from './Assets/stccg-logo.png'


/* the "handshake" between both players' browsers to agree to play with
 * each other, and to create a document in "games" to record their play,
 * takes place in this component for _BOTH_ players.  There are two entirely
 * separate series of UI events, db actions and promises, and data
 * manipulation threaded through the code here.  This intended sequence
 * is outlined here

       PLAYER ONE                                      PLAYER TWO
       ----------                                      ----------

 user clicks "Get Game Code"
 generateGameCode_
   generates a random code
   checks db; repeats until no match found
   writes a new gameOffers doc
   set event listener on gameOffer
   change state: display Game Code
                                     ------------>
                                                       user enters Game Code in page
                                                       user clicks "Play Game"
                                                       startGame_
                                                         reads gameOffer for entered Code
                                                         updates gameOffer with accepted:true
                                     <------------
                                                         get a reference for games doc
                                                         set event listener on gameOffer
 onGameOfferAccepted_
   delete accepted gameOffers doc
   create doc in games collection
                                     ------------>
   fetch doc for opponent from users
   navigate to /play
                                                       (anon callback function)
                                                         update games doc for own deckId
                                                         fetch doc for opponent from users
                                                         navigate to /play

 */

class StartGame extends Component {
  static propTypes = {
    userId: PropTypes.string,
    displayName: PropTypes.string,
    deck: PropTypes.object,
    doSignOut: PropTypes.func.isRequired,
    doStartPlaying: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      canTakeCode: true,
      generatedGameCode: null,
      offerUnsubscribe: null,
      enteredGameCode: ""
    };
  }

  render() {
    if (!this.props.userId ||
        !this.props.displayName ||
        !this.props.deck) {
      return <Redirect to="/" />;
    }

    let gameCode;
    if (this.state.canTakeCode) {
      gameCode = (
        <div>
          <div className="startGame__controlColumn startGame__controlColumnLeft">
            <a className="startGame__playGame" onClick={this.generateGameCode_}>
              Get Game Code
              <img src={badgeIconCommand} className="startGame__playArrow" alt="" />
            </a>
          </div>
          <div className="startGame__controlColumn startGame__controlColumnRight">
            <label>Partner's Game Code:</label>
            <input
              type="text"
              className="startGame__gameCodeEntry"
              value={this.state.enteredGameCode}
              onChange={this.updateEnteredGameCode_}
            />
            <a className="startGame__playGame" onClick={this.startGame_}>
              Play Game
              <img src={badgeIconCommand} className="startGame__playArrow" alt="" />
            </a>
          </div>
        </div>
      );
    } else {
      gameCode = (
        <div className="startGame__gameCodeContainer">
          <div className="startGame__controlColumn startGame__controlColumnLeft">
            Game Code for your partner:
            <div className="startGame__gameCode">{this.state.generatedGameCode}</div>
          </div>
          <div className="startGame__controlColumn startGame__controlColumnRight">
            waiting......
            <div className="startGame__spinnerContainer">
              <img src={spinner} className="startGame__spinner" alt="Authorization in progress" />
            </div>
            <a className="startGame__cancelGameCode" onClick={this.cancelGameCode_}>cancel</a>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Profile
          displayName={this.props.displayName}
          doSignOut={this.props.doSignOut}
        />
        <Link className="startGame__changeDeck" to="/">
          <img src={badgeIconCommand} className="startGame__deckArrow" alt="" />
          Change Deck
        </Link>
        <h1 className="startGame__title">Choose Your Opponent</h1>

        <div className="startGame__description">
          You'll be playing with
          your <span className="startGame__deckName">{this.props.deck.name}</span> deck.
          Pair up with someone to play with &mdash; either generate a Game Code
          to share with your opponent <i>or</i> enter a Game Code from your opponent
          below.

          {gameCode}
        </div>
      </div>
    );
  }

  generateGameCode_ = () => {
    const self = this;
    const code = this.randomGameCode_();

    const db = firestore();
    db
      .collection("gameOffers")
      .where("gameCode", "==", code)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          console.log("Found a collision with the code '" + code + "', retrying.");
          self.generateGameCode_();
        } else {
          db
            .collection("gameOffers")
            .add({
              gameCode: code,
              issued: firebase.firestore.Timestamp.now(),
              fromId: self.props.userId,
              accepted: false,
              byId: null
            })
            .then(function(docRef) {
              const offerId = docRef.id;
              const offerRef = db.collection("gameOffers").doc(offerId);
              const offerUnsubscribe = offerRef
                .onSnapshot(function(snapshot) {
                  const gameOffer = snapshot.data();
                  if (gameOffer.accepted) {
                    self.onGameOfferAccepted_(offerId, gameOffer.byId);
                  }
                }, function(error) {
                  console.log(
                    "Error received by event handler for 'gameOffers' changes on '" + code + "': ",
                    error
                  );
                });

              self.setState({
                generatedGameCode: code,
                canTakeCode: false,
                offerUnsubscribe: offerUnsubscribe
              });
            })
            .catch(function(error) {
              console.log("Error writing new 'gameOffers' document: ", error);
            });
        }
      })
      .catch(function(error) {
        console.log("Error checking for conflicting 'gameOffers' document: ", error);
      });
  };

  onGameOfferAccepted_ = (offerId, opponentId) => {
    if (this.state.offerUnsubscribe) {
      this.state.offerUnsubscribe();
    }

    const db = firestore();
    db.collection("gameOffers").doc(offerId).delete();

    db
      .collection("games")
      .doc(offerId)
      .set({
        playerOneId: this.props.userId,
        playerOneDeckId: this.props.deck.id,
        playerOneScore: 0,
        playerTwoId: opponentId,
        playerTwoDeckId: null,
        playerTwoScore: 0,
        started: firebase.firestore.Timestamp.now(),
        finished: null,
        winnerId: null,
        concessionId: null
      });

    this.getOpponentDocAndStartPlaying_(offerId, opponentId);
  };

  randomGameCode_ = () => {
    const capANum = "A".charCodeAt(0);
    let code = "";

    for (let c = 0; c < 4; c++) {
      const charNum = Math.floor(Math.random() * 26);
      code += String.fromCharCode(capANum + charNum);
    }

    return code;
  };

  startGame_ = () => {
    const self = this;
    const db = firestore();

    // get the db doc for the gameOffer with the Game Code the user gave
    db
      .collection("gameOffers")
      .where("gameCode", "==", self.state.enteredGameCode)
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.empty) {
          alert("Couldn't find that code, sorry.");
          self.setState({enteredGameCode: ""});
        } else {
          const offerId = querySnapshot.docs[0].id;

    // update the gameOffer to accept it
          db
            .collection("gameOffers")
            .doc(offerId)
            .update({
              accepted: true,
              byId: self.props.userId
            })
            .then(function() {
    // now get (a reference for) the game record itself
              let gameRef = db.collection("games").doc(offerId);
              const unsubscribe = gameRef
                .onSnapshot(function(snapshot) {
                  const game = snapshot.data();
                  if (!game) {
                    return;
                  }

                  unsubscribe();

    // got the game record, update with our deckId, find our opponent
                  gameRef = db.collection("games").doc(offerId); // redundant???????
                  gameRef.update({playerTwoDeckId: self.props.deck.id});

                  self.getOpponentDocAndStartPlaying_(offerId, game.playerOneId);
                }, function(error) {
                  unsubscribe();
                  console.log(
                    "Error received by event handler for 'games' looking for new game '" + offerId + "': ",
                    error
                  );
                });
            })
            .catch(function(error) {
              console.log("Error updating (accepting) 'gameOffers' document: ", error);
            });
        }
      })
      .catch(function(error) {
        console.log("Error checking for matching 'gameOffers' document: ", error);
      });
  };

  cancelGameCode_ = () => {
    if (this.state.offerUnsubscribe) {
      this.state.offerUnsubscribe();
    }

    this.setState({
      generatedGameCode: null,
      canTakeCode: true
    });
  };

  updateEnteredGameCode_ = (event) => {
    this.setState({enteredGameCode: event.target.value});
  };

  getOpponentDocAndStartPlaying_ = (gameId, opponentId) => {
    const self = this;
    const db = firestore();

    db
      .collection("users")
      .doc(opponentId)
      .get()
      .then(function(snapshot) {
        const opponent = snapshot.data();
        opponent.id = opponentId;
        self.props.doStartPlaying(gameId, opponent);
      })
      .catch(function(error) {
        console.log("Error getting opponent's 'user' document: ", error);
      });
  }
}

export default StartGame;
