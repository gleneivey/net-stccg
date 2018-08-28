import React, { Component } from "react";
import PropTypes from "prop-types"
import { DragSource } from "react-dnd";
import "./CardInPlay.css";

import cardData from "../../CardData/data";
const { cardMap } = cardData;

class CardInPlay extends Component {
  static propTypes = {
    cardId: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    cardWidthInPx: PropTypes.number.isRequired,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,

    // Injected by React DnD:
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  render() {
    const { cardId, isDragging, connectDragSource } = this.props;
    const card = cardMap[cardId];

    return connectDragSource(
      <img
        src={card.imageUrl} className="cardInPlay__cardImage"
        alt={"Image of card '" + card.name + "'"}
        style={{
          top: this.props.y,
          left: this.props.x,
          width: this.props.cardWidthInPx,
          opacity: isDragging ? 0.5 : 1
        }}
      />
    );
  }
}



function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specification = {
  beginDrag: function(props) {
    if (props.onDragStart) { props.onDragStart(); }

    const item = {
      cardId: props.cardId
    };
    return item;
  },

  endDrag: function(props) {
    if (props.onDragEnd) {props.onDragEnd(); }
  }
};

export default DragSource("card", specification, collect)(CardInPlay);
