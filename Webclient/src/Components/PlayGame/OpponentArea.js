import React, { Component } from "react";
import PropTypes from "prop-types"
import "./OpponentArea.css";

class OpponentArea extends Component {
  static propTypes = {
    showDebug: PropTypes.bool.isRequired,
  };

  render() {
    return <div className="opponentArea__container">
      [opponent area]
    </div>;
  }
}

export default OpponentArea;
