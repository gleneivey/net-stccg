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
import icon_Non from "../Assets/Icons/icon_Non.gif"
import icon_artifact from "../Assets/Icons/icon_artifact.gif"
import icon_interrupt from "../Assets/Icons/icon_interrupt.gif"
import icon_event from "../Assets/Icons/icon_event.gif"
import icon_equipment from "../Assets/Icons/icon_equipment.gif"
import icon_dilemma_sp from "../Assets/Icons/icon_dilemma_sp.gif"
import icon_dilemma_p from "../Assets/Icons/icon_dilemma_p.gif"
import icon_dilemma_s from "../Assets/Icons/icon_dilemma_s.gif"

import cardData from "../CardData/data";
const { cardMap } = cardData;

const icons = {
  "facility_Fed": icon_facility_Fed,
  "facility_Kli": icon_facility_Kli,
  "facility_Rom": icon_facility_Rom,
  "Fed": icon_Fed,
  "Kli": icon_Kli,
  "Rom": icon_Rom,
  "Non": icon_Non,
  "artifact": icon_artifact,
  "interrupt": icon_interrupt,
  "event": icon_event,
  "equipment": icon_equipment,
  "dilemma_sp": icon_dilemma_sp,
  "dilemma_s": icon_dilemma_s,
  "dilemma_p": icon_dilemma_p,
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
    if (!this.props.showDebug) {
      return (
        <div className="cardHoverDetail__container">
          <img src={card.imageUrl} className="cardHoverDetail__image" alt={"Image of card '" + card.name + "'"} />
        </div>
      );
    }

    // missions aren't like anything else, handle them here //////////////////////////////////////////////////////
    if (card.type === "mission") {
      return (
        <div className="cardHoverDetail__container">
          <div className="cHD__cardOutline" ref={el => (this.containerEl = el)}>
            <div className="cHD__missionName">{card.name}</div>
            <div className="cHD__missionText" dangerouslySetInnerHTML={{ __html: card.text }} />
            <div className="cHD__missionRules" dangerouslySetInnerHTML={{ __html: card.rules }} />
            <div className="cHD__missionAffiliations">
              {card.affiliation.map(affil => (
                <div className={"cHD__missionAffiliation cHD__missionAffiliation--" + affil} />
              ))}
            </div>
            <div className="cHD__missionPoints">{card.details.points}</div>
            <div className="cHD__missionSpan">{card.details.span}</div>
          </div>
        </div>
      );
    }


    // all card types other than missions ////////////////////////////////////////////////////////////////////////

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

    const blockClasses = "cHD__cardBlock cHD__cardBlock--"+icon;
    const textClasses = "cHD__cardText cHD__cardText--"+icon;
    const rulesClasses = "cHD__cardRules cHD__cardRules--"+icon;
    const affiliationIconClasses = "cHD__affiliationIcon cHD__affiliationIcon--"+icon;

    let title, maybeOutpost, maybeBlock;
    let upperLeftIcon, lowerIcon;

    title = card.name;
    if (card.block) {
      maybeBlock = <div className={blockClasses}>{card.block}</div>
    }

    if (card.type === "facility") {
      upperLeftIcon = <img src={icons[icon + "_" + affiliation]} className={iconClasses} alt={icon}/>;
      lowerIcon = <img src={icons[affiliation]} className={affiliationIconClasses} alt={affiliation}/>;

      maybeOutpost = (
        <div>
          <div className="cHD__outpost">OUTPOST</div>
          <div className="cHD__outpostShields">SHIELDS {card.details.shields}</div>
        </div>
      );
    } else if (["person","ship"].includes(card.type)) {
      upperLeftIcon = <img src={icons[affiliation]} className={iconClasses} alt={affiliation} />;
    } else if (["interrupt","event","equipment","artifact","dilemma"].includes(card.type)) {
      title = card.type.toUpperCase();
      let qualifier = "";
      if (card.type === "dilemma") {
        qualifier = "_p";
      }
      upperLeftIcon = <img src={icons[icon + qualifier]} className={iconClasses} alt={icon} />;
      maybeBlock = <div className={blockClasses}>{card.name}</div>
    }

    return (
      <div className="cardHoverDetail__container">
        <div className="cHD__cardOutline" ref={el => (this.containerEl = el)}>
          {upperLeftIcon}
          <div className="cHD__cardTitle">
            {maybeMultiple} {title}
          </div>
          <div className={textClasses}>{card.text}</div>
          <div className={rulesClasses}>
            <div dangerouslySetInnerHTML={{ __html: card.rules }}/>
            <ul className="cHD__cardAttributeList">
              {card.attributes.map((attr) =>
                <li
                  className="cHD__cardAttribute"
                  dangerouslySetInnerHTML={{ __html: attr }}
                />
              )}
            </ul>
          </div>
          {maybeBlock}
          {lowerIcon}
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
