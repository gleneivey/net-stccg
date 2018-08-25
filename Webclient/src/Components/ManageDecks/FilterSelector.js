import React, { Component } from "react";
import PropTypes from "prop-types"
import "./FilterSelector.css";
import classNames from "classnames";

class FilterSelector extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    tags: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    filterActive: PropTypes.bool.isRequired,
    callback: PropTypes.func.isRequired
  };

  render() {
    const containerClasses = classNames({
      "filterSelector__title": true,
      "filterSelector__title--closed": !this.props.filterActive
    });

    let allButton, noneButton, selectorList;
    if (this.props.filterActive) {
      allButton = (
        <button
          className="button filterSelector__presetButton"
          onClick={this.allButton_}
        >all</button>
      );
      noneButton = (
        <button
          className="button filterSelector__presetButton"
          onClick={this.noneButton_}
        >none</button>
      );
      selectorList = Object.keys(this.props.tags).map(key => (
          <div key={key} className="filterSelector__itemName">
            <input
              type="checkbox"
              checked={this.props.filters[key] || false}
              onChange={this.checkboxOnChange_}
            />
            {this.props.tags[key]}
          </div>
      ));
    }

    return (
      <div className="filterSelector">
        <div className={containerClasses} onClick={this.toggleOpenClose_}>
          {this.props.name}
          {allButton}
          {noneButton}
        </div>
        {selectorList}
      </div>
    );
  }

  allFiltersEqual_ = (value) => {
    const newFilters = {};
    Object.keys(this.props.tags).forEach((key) => {
      newFilters[key] = value;
    });
    this.props.callback(this.props.filterActive, newFilters);
  };

  allButton_ = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.allFiltersEqual_(true);
  };

  noneButton_ = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.allFiltersEqual_(false);
  };

  checkboxOnChange_ = (event) => {
    const keyName = event.target.parentElement.textContent;
    const keys = Object.keys(this.props.tags);
    const key = (keys.filter(x => this.props.tags[x] === keyName));
    const value = event.target.checked;
    this.props.filters[key] = value;
    this.props.callback(this.props.filterActive, this.props.filters);
  };

  toggleOpenClose_ = () => {
    this.props.callback(!this.props.filterActive, this.props.filters);
  };
}

export default FilterSelector;
