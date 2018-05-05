import React from 'react';
import PropTypes from 'prop-types';
import Constants from './Constants';

const GameStatus = (props) => {
  
  if (props.winner > 0) {
    return (
    		<div>
        	<p>{Constants.colors[props.currentPlayer]} Player has won the game!</p>
        	<button onClick={props.onRestartClicked}>Play Again</button>
        </div>
    );
  }
  if (props.currentPlayer === -1) {
  	return (
    	<div>
    		<p>Game Over!</p>
      	<button onClick={props.onRestartClicked}>Restart Game</button>
      </div>
      );
  }
  else {
  	return ( 
    	<p>{Constants.colors[props.currentPlayer]} Player turn</p>
    );
  }
}
GameStatus.propTypes = {
  currentPlayer: PropTypes.number.isRequired,
  onRestartClicked: PropTypes.func.isRequired,
  winner: PropTypes.number,
};
module.exports = GameStatus;