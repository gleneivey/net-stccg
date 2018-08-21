import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd';
import './CardName.css';

class CardName extends Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
    inSubDeck: PropTypes.string,
    showDetailsFor: PropTypes.func.isRequired,
    dontShowDetails: PropTypes.func.isRequired,

    // Injected by React DnD:
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  render() {
    const { card, isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div
        className="card__container"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div
          className="card__card"
          onMouseEnter={this.onMouseEnter_}
          onMouseLeave={this.props.dontShowDetails}
        >
          {card.name}
        </div>
      </div>
    );
  }

  onMouseEnter_ = () => {
    this.props.showDetailsFor(this.props.card.id);
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
    const item = {
      cardId: props.card.id
    };
    if (props.inSubDeck) {
      item.fromSubdeck = props.inSubDeck;
    }
    return item;
  }
};

export default DragSource("card", specification, collect)(CardName);
