import React, { Component } from "react";
import PropTypes from "prop-types"
import "./PlayGame.css";
import "./Spaceline.css";

class Spaceline extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
  };

  render() {
console.log(this.props.locations);

    return (
      <div className="spaceline__container">
        {this.props.locations.map(location => (
          <div className="spaceline__location">
            &nbsp;
          </div>
        ))}
      </div>
    );
  }
}

export default Spaceline;
