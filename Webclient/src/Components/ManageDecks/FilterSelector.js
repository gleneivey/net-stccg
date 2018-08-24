import React, { Component } from "react";
import PropTypes from "prop-types"
import "./FilterSelector.css";

class FilterSelector extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    tags: PropTypes.object.isRequired,
    callback: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="filterSelector">
        <div className="filterSelector__title">{this.props.name}</div>
        {Object.keys(this.props.tags).map(key => (
          <div key={key} className="filterSelector__itemName">{this.props.tags[key]}</div>
        ))}
      </div>
    );
  }
}

export default FilterSelector;
