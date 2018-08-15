import React, { Component } from 'react';
import './SignIn.css';

class SignIn extends Component {
  render() {
    return (
      <div className="signin__container">
        <button
          className="signin__button"
          onClick={this.props.doSignIn}
        >
          
        </button>
      </div>
    );
  }
}

export default SignIn;
