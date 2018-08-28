import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayGame.css";
import "./Spaceline.css";
import SpacelineLocation from "./SpacelineLocation";

class Spaceline extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    cardWidthInPx: PropTypes.number.isRequired
  };

  render() {
console.log(this.props.locations);

    return (
      <div className="spaceline__container">
        {this.props.locations.map((location, index) => (
          <SpacelineLocation
            key={index}
            index={index}
            thisLocation={location}
            adjacents={[
              location > 0 ? this.props.locations[location-1] : null,
              location < this.props.locations.length-1 ? this.props.locations[location+1] : null
            ]}
            cardWidthInPx={this.props.cardWidthInPx}
          />
        ))}
      </div>
    );
  }
}

export default Spaceline;
