import React, { Component } from "react";
import PropTypes from "prop-types"
import { DropTarget } from "react-dnd";
import classNames from "classnames";
import "./SpacelineLocation.css";

import cardData from "../../CardData/data";
const { cardMap } = cardData;

class SpacelineLocation extends Component {
  static propTypes = {
    thisLocation: PropTypes.object.isRequired,
    adjacents: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,

    // Injected by React DnD:
    connectDropTarget: PropTypes.func.isRequired,
    cantDrop: PropTypes.bool.isRequired
  };

  render() {
    const cardId = this.props.thisLocation.cardId;
    const card = cardMap[cardId];
    const aspectRatio = (3.5/2.5);

    const locationClasses = classNames({
      "spacelineLocation__empty": true,
      "spacelineLocation__empty--cantDrop": this.props.cantDrop
    });

    return this.props.connectDropTarget(
      cardId ? (
        <img
          src={card.imageUrl} className="spacelineLocation__mission"
          alt={"Image of card '" + card.name + "'"}
          style={{width: this.props.cardWidthInPx}}
        />
      ) : (
        <div
          className={locationClasses}
          style={{
            width: this.props.cardWidthInPx,
            height: aspectRatio * this.props.cardWidthInPx
          }}
        >
          &nbsp;
        </div>
      )
    );
  }

  placeDroppedCardInThisLocation_ = (item) => {
console.log("DROPPED IN");
  }
}


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    cantDrop: monitor.isOver() && !monitor.canDrop()
  };
}

const specification = {
  drop: function (props, monitor, component) {
    component.placeDroppedCardInThisLocation_(monitor.getItem());
  },
  canDrop: function (props, monitor) {
    return !props.thisLocation.cardId;
  }
};

export default DropTarget("card", specification, collect)(SpacelineLocation);
