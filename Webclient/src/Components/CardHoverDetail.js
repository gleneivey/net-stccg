import React, { Component } from "react";
import PropTypes from "prop-types"
import $ from "jquery";
import "./CardHoverDetail.css";

import icon_facility_Fed from "../Assets/Icons/icon_facility_Fed.gif"
import icon_facility_Kli from "../Assets/Icons/icon_facility_Kli.gif"
import icon_facility_Rom from "../Assets/Icons/icon_facility_Rom.gif"
import icon_Fed from "../Assets/Icons/icon_Fed.gif"
import icon_Kli from "../Assets/Icons/icon_Kli.gif"
import icon_Rom from "../Assets/Icons/icon_Rom.gif"

import cardData from "../CardData/data";
const { cardMap } = cardData;

const icons = {
  "facility_Fed": icon_facility_Fed,
  "facility_Kli": icon_facility_Kli,
  "facility_Rom": icon_facility_Rom,
  "Fed": icon_Fed,
  "Kli": icon_Kli,
  "Rom": icon_Rom,
};

class CardHoverDetail extends Component {
  static propTypes = {
    showDebug: PropTypes.bool.isRequired,
    cardId: PropTypes.string,
  };

  componentDidMount() {
    this.fixCardOutlineHeight_();
  }

  componentDidUpdate() {
    this.fixCardOutlineHeight_();
  }

  render() {
    if (!this.props.cardId) {
      return <div />;
    }

    const card = cardMap[this.props.cardId];
console.log(card);
    if (!this.props.showDebug) {
      return (
        <div className="cardHoverDetail__container">
          <img src={card.imageUrl} className="cardHoverDetail__image" alt={"Image of card '" + card.name + "'"} />
        </div>
      );
    }

    let affiliation = card.affiliation;
    if (!affiliation && card.type === "facility") {    // temporary for bad data
      affiliation = card.name.substr(0,3);
    }

    const icon = card.type;
    const iconClasses = "cHD__cardIcon cHD__cardIcon--"+icon;
    let maybeMultiple = null;
    if (card.multiple) {
      maybeMultiple = <span> &#10070;</span>;
    }
    const title = card.name;
    const textClasses = "cHD__cardText cHD__cardText--"+icon;
    const rulesClasses = "cHD__cardRules cHD__cardRules--"+icon;
    const affiliationIconClasses = "cHD__affiliationIcon cHD__affiliationIcon--"+icon;

    let maybeOutpost;
    if (card.type === "facility") {
      maybeOutpost = (
        <div>
          <div className="cHD__outpost">OUTPOST</div>
          <div className="cHD__outpostShields">SHIELDS {card.details.shields}</div>
        </div>
      );
    }


    return (
      <div className="cardHoverDetail__container">
        <div className="cHD__cardOutline" ref={el => (this.containerEl = el)}>
          <img src={icons[icon + "_" + affiliation]} className={iconClasses} alt={icon} />
          <div className="cHD__cardTitle">
            {maybeMultiple} {title}
          </div>
          <div className={textClasses}>{card.text}</div>
          <div
            className={rulesClasses}
            dangerouslySetInnerHTML={{ __html: card.rules }}
          />
          <img src={icons[affiliation]} className={affiliationIconClasses} alt={affiliation} />
          {maybeOutpost}
        </div>
      </div>
    );
  }

  fixCardOutlineHeight_ = () => {
    if (!this.containerEl) { return; }
    const width = $(this.containerEl).width();
    this.containerEl.style.height = Math.floor(width * (3.5/2.5)) + "px";
  };
}

export default CardHoverDetail;
