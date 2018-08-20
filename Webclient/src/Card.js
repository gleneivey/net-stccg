import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd';
import './Card.css';

const cardSource = {
  beginDrag: function(props) {
    return {
      card: props.card
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


class Card extends Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
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

export default DragSource("card", cardSource, collect)(Card);
