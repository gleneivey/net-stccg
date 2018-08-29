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
    droppedIntoSpaceline: PropTypes.func.isRequired,

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
    this.props.droppedIntoSpaceline(item, this.props.index);
  };

  canBeDroppedOn_ = () => {
    return SpacelineLocation.canBeDroppedOn(this.props);
  };

  static canBeDroppedOn(props) {
    const canBeDroppedOn = !props.thisLocation.cardId && (
      props.index === 6 ||
      (props.adjacents[0] && props.adjacents[0].cardId) ||
      (props.adjacents[1] && props.adjacents[1].cardId)
    );
    return canBeDroppedOn;
  }
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
    return SpacelineLocation.canBeDroppedOn(props);
  }
};

export default DropTarget("card", specification, collect)(SpacelineLocation);
