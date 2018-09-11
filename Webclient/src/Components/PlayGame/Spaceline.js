import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayGame.css";
import "./Spaceline.css";
import SpacelineLocation from "./SpacelineLocation";
import PlayMaker from "../../Models/PlayMaker";

class Spaceline extends Component {
  static propTypes = {
    showDebug: PropTypes.bool.isRequired,
    game: PropTypes.object.isRequired,
    locations: PropTypes.array.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    draggingTo: PropTypes.bool.isRequired,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired,
  };

  render() {
    let spaceline = this.spacelineFromLocations_(this.props.locations);
    if (this.props.game.iAmPlayerTwo()) {
      spaceline = spaceline.reverse();
    }

    return (
      <div className="spaceline__container">
        {spaceline.map((location, index) => (
          <SpacelineLocation
            key={index}
            index={index}
            game={this.props.game}
            thisLocation={location}
            adjacents={[
              index > 0 ? spaceline[index-1] : null,
              index < spaceline.length-1 ? spaceline[index+1] : null
            ]}
            showAsDroppable={this.props.draggingTo}
            cardWidthInPx={this.props.cardWidthInPx}
            droppedIntoSpaceline={this.droppedIntoSpaceline_}
            showDetailsFor={this.props.showDetailsFor}
            dontShowDetails={this.props.dontShowDetails}
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
    if (this.props.game.iAmPlayerTwo()) {
      index = 12 - index;
    }

    const spaceline = this.spacelineFromLocations_(this.props.locations);
    spaceline[index] = item;
    (new PlayMaker(this.props.game)).updateLocations(spaceline, index);
  };
}

export default Spaceline;
