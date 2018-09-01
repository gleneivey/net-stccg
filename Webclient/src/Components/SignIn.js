import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleButton from "react-google-button"
import "./SignIn.css";
import firebase from "../firebase.js";
import logo from "../Assets/stccg-logo.png"

class SignIn extends Component {
  static propTypes = {
    doSignIn: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="signin__container">
        <h1>net-stccg</h1>
        <p className="signin__topOfPageText">
          <img src={logo} className="signin__textLogo" alt="" />
          Play the <b><a href="https://en.wikipedia.org/wiki/Star_Trek_Customizable_Card_Game">Star Trek
          Customizable Card Game</a></b> browser-to-browser
          <img src={logo} className="signin__textLogo" alt="" />
        </p>

        <div className="signin__button">
          <GoogleButton
            onClick={this.doSignIn_}
          />
        </div>

        <div className="signin__footer">
          <p className="signin__bottomOfPageText">
            This site is a non-commercial, fan production with no affiliation with any other group
            or organization involved in <i>Star Trek</i> or the <i>Star Trek Customizable Card Game</i>.
            It is not endorsed, sponsored or affiliated with CBS Studios Inc. or the Star Trek franchise.
          </p>
          <ul className="signin__credits">
            <li>All STAR TREK trademarks and logos are owned by CBS Studios Inc.</li>
            <li>
              The <i>Star Trek Customizable Card Game</i> is intellectual property of
              <a href="http://www.decipher.com/">Decipher, Inc.</a>
            </li>
            <li>
              Card images are from the game's
              <a href="https://www.trekcc.org/">Continuing Committee</a> website
            </li>
          </ul>
        </div>
      </div>
    );
  }

  doSignIn_ = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.props.doSignIn(result.user.displayName, result.user.email);
      });
  }
}

export default SignIn;
