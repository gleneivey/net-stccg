import Model from './Model';

class Game extends Model {
  constructor(playerId, playerName, gameData) {
    super();
    this.lastPlay = null;
    this.playerId = playerId;
    this.playerName = playerName;
    this.data = gameData;
    this.state = {};
  }

  advanceState(plays) {
    plays.forEach((play) => {
console.log("Game#advanceState");
console.log(play);

      if (!this.state.phase) {
        this.state.phase = "initialization";
        this.state.locations = [];
      }

      if (Object.keys(play).includes("setDecks")) {
        const decksToSet = JSON.parse(JSON.stringify(play.setDecks));
        delete decksToSet.for;
        Object.keys(decksToSet).forEach((key) => {
          this.state[play.setDecks.for] = this.state[play.setDecks.for] || {};
          this.state[play.setDecks.for][key] = decksToSet[key];
        });
      }

      switch(play.type) {
        case "setDecks":
          // nothing but setDecks key expected....
          break;
        case "setLocations":
          this.state.locations = play.setLocations;
          break;
        default:
          console.log("Don't know how to process the 'play':");
          console.log(play);
      }

      this.lastPlay = play.id;
      if (play.advancePhaseTo) {
        this.state.phase = play.advancePhaseTo;
      }
console.log(JSON.stringify(this.state));
    });
  }
}

export default Game;
