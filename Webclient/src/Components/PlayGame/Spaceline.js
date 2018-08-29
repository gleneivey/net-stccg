import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayGame.css";
import "./Spaceline.css";
import SpacelineLocation from "./SpacelineLocation";
import Game from "../../Models/Game";

class Spaceline extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    draggingTo: PropTypes.bool.isRequired,
    game: PropTypes.object.isRequired,
    updateTurnedCard: PropTypes.func.isRequired,
  };

  render() {
    const remaining = 13 - this.props.locations.length;
    const spaceline = this.spacelineFromLocations_(this.props.locations);

    return (
      <div className="spaceline__container">
        {spaceline.map((location, index) => (
          <SpacelineLocation
            key={index}
            index={index}
            thisLocation={location}
            adjacents={[
              location > 0 ? spaceline[location-1] : null,
              location < spaceline.length-1 ? spaceline[location+1] : null
            ]}
            showAsDroppable={this.props.draggingTo}
            cardWidthInPx={this.props.cardWidthInPx}
            droppedIntoSpaceline={this.droppedIntoSpaceline_}
          />
        ))}
      </div>
    );
  }

  spacelineFromLocations_ = (locations) => {
    const remaining = 13 - locations.length;
    return Array(Math.floor(remaining / 2.0)).fill({})
      .concat(locations).concat(
        Array(Math.floor((remaining / 2.0)+0.5)).fill({})
      );
  };

  droppedIntoSpaceline_ = (item, index) => {
    const spaceline = this.spacelineFromLocations_(this.props.locations);
    spaceline[index] = { cardId: item.cardId };
    Game.updateLocations.bind(this)(spaceline, index);
    this.props.updateTurnedCard(null);
  };
}

export default Spaceline;
