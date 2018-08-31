import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayGame.css";
import "./Spaceline.css";
import SpacelineLocation from "./SpacelineLocation";
import PlayMaker from "../../Models/PlayMaker";

class Spaceline extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    draggingTo: PropTypes.bool.isRequired,
    game: PropTypes.object.isRequired,
    updateTurnedCard: PropTypes.func.isRequired,
  };

  render() {
    const spaceline = this.spacelineFromLocations_(this.props.locations);

    return (
      <div className="spaceline__container">
        {spaceline.map((location, index) => (
          <SpacelineLocation
            key={index}
            index={index}
            thisLocation={location}
            adjacents={[
              index > 0 ? spaceline[index-1] : null,
              index < spaceline.length-1 ? spaceline[index+1] : null
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
    (new PlayMaker(this.props.game)).updateLocations(spaceline, index);
    this.props.updateTurnedCard(null);
  };
}

export default Spaceline;
