import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom';
import './StartGame.css';
import Profile from './Profile';
import badgeIconCommand from './badge-icon-command.svg'

class StartGame extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
    opponent: PropTypes.object.isRequired,
    currentGameId: PropTypes.string.isRequired,
    doSignOut: PropTypes.func.isRequired
  };

  render() {
    if (!this.props.player || !this.props.opponent) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Profile
          displayName={this.props.player.displayName}
          doSignOut={this.props.doSignOut}
        />
        <h1 className="playGame__title">
          Playing Against {this.props.opponent.displayName}
          </h1>
      </div>
    );
  }
}

export default StartGame;
