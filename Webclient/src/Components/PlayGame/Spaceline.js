import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayGame.css";
import "./Spaceline.css";
import SpacelineLocation from "./SpacelineLocation";

class Spaceline extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    draggingTo: PropTypes.bool.isRequired
  };

  render() {
    const remaining = 13 - this.props.locations.length;
    const spaceline = Array(Math.floor(remaining / 2.0)).fill({})
      .concat(this.props.locations).concat(
        Array(Math.floor((remaining / 2.0)+0.5)).fill({})
      );

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
          />
        ))}
      </div>
    );
  }
}

export default Spaceline;
