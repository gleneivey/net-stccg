import React, { Component } from "react";
import PropTypes from "prop-types"
import { DropTarget } from "react-dnd";
import "./DeckContentDelete.css";
import trashCan from "../../Assets/delete.svg"

class DeckContentDelete extends Component {
  static propTypes = {
    removeCardFromSubDeck: PropTypes.func.isRequired,

    // Injected by React DnD:
    connectDropTarget: PropTypes.func.isRequired
  };

  render() {
    return this.props.connectDropTarget(
      <img src={trashCan} className="deckContentDelete__dropTarget" alt=""/>
    );
  }
}


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

const specification = {
  drop: function (props, monitor, component) {
    component.props.removeCardFromSubDeck(monitor.getItem());
  },
  canDrop: function (props, monitor) {
    return !!monitor.getItem().fromSubdeck;
  }
};

export default DropTarget("card", specification, collect)(DeckContentDelete);
