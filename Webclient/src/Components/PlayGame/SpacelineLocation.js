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
    showAsDroppable: PropTypes.bool.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,

    // Injected by React DnD:
    connectDropTarget: PropTypes.func.isRequired,
    cantDrop: PropTypes.bool.isRequired
  };

  render() {
    const cardId = this.props.thisLocation.cardId;
    const card = cardMap[cardId];
    const aspectRatio = (3.5/2.5);

    const canBeDroppedOn = this.canBeDroppedOn_();
    const locationClasses = classNames({
      "spacelineLocation__empty": true,
      "spacelineLocation__empty--canDrop": this.props.showAsDroppable && canBeDroppedOn,
      "spacelineLocation__empty--cantDrop": this.props.showAsDroppable && !canBeDroppedOn
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
  };

  canBeDroppedOn_ = () => {
    return !this.props.thisLocation.cardId && (
      this.props.index === 6 ||
      (this.props.adjacents[0] && this.props.adjacents[0].cardId) ||
      (this.props.adjacents[1] && this.props.adjacents[1].cardId)
    );
  };
}


function collect(connect, monitor) {
  const collection = {
    connectDropTarget: connect.dropTarget(),
    cantDrop: monitor.isOver() && !monitor.canDrop()
  };
  return collection;
}

const specification = {
  drop: function (props, monitor, component) {
    component.placeDroppedCardInThisLocation_(monitor.getItem());
  },
  canDrop: function (props, monitor, component) {
    if (!component) { return false; }
    return component.canBeDroppedOn_();
  }
};

export default DropTarget("card", specification, collect)(SpacelineLocation);
