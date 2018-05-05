import React from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import GameStatus from './GameStatus';
import Constants from './Constants';

export default class Game extends React.Component {

    static createEmptyBoard(rows, cols, emptyValue) {
  
    var matrix = [];
    for(var i=0; i<rows; i++) {
        matrix[i] = [];
        for(var j=0; j<cols; j++) {
            matrix[i][j] = emptyValue;
        }
    }    
    return matrix;
  }

  static initialState = () => ({
  	rowCount: Constants.defaultRows,
    colCount: Constants.defaultColumns,
    slotValues: Game.createEmptyBoard(Constants.defaultRows,Constants.defaultColumns, 0),
    slotTransitions: Game.createEmptyBoard(Constants.defaultRows,Constants.defaultColumns, null),
    startPlayer: 1,
    currentPlayer: 1,
    winner: 0
  });
  
  restartGame = () => {
    var restartState = Game.initialState();
    // Switch start player to make it fair
    if (this.state.startPlayer === 1) {
      restartState.startPlayer = 2;
    }
    else {
      restartState.startPlayer = 1;
    }
    restartState.currentPlayer = restartState.startPlayer;

  	this.setState(restartState);
  }
  
  checkBoardInDirection = (row, col, rowDelta, colDelta) => {
    var currentValue = this.state.slotValues[row][col];
       
    if (row + (3*rowDelta) > (this.state.rowCount-1) || row + (3*rowDelta) < 0)
    	return false;  // impossible as too close to the edge of the board
    
    if (col + (3*colDelta) > (this.state.colCount-1) || col + (3*colDelta) < 0)
    	return false;  // impossible as too close to the edge of the board
      
    var allSame = true;
    for (var i=1; i<=3; i++) {	// Look for the next 3 pieces, applying the deltas
			row = row + rowDelta;
      col = col + colDelta;
      var valueAtPosition = this.state.slotValues[row][col];
      if (valueAtPosition !== currentValue) {
      	allSame = false;
        break;
      }
    }
		return allSame;
  }

  // Loop through the board, and for matches
  findWinner = (row, col) => {

    // Optimization: we only need to check the recently added piece, and check in 4 directions for the same value
    var currentValue = this.state.slotValues[row][col];
    if (currentValue <= 0) {
    	return 0; // No winner
    }
    
    // Up
    // No need to look up as we always add a piece on top
    
    // Down
    var result = this.checkBoardInDirection(row,col,1,0);
    if (result) return currentValue;
    
    // Left
    result = this.checkBoardInDirection(row,col,0,-1);
    if (result) return currentValue;

    // Right
    result = this.checkBoardInDirection(row,col,0,1);
    if (result) return currentValue;
    
    // Up left diagonal
    result = this.checkBoardInDirection(row,col,-1,-1);
    if (result) return currentValue;
    
    // Up right diagonal
    result = this.checkBoardInDirection(row,col,-1,1);
    if (result) return currentValue;
    
    // Down left diagonal
    result = this.checkBoardInDirection(row,col,1,-1);
    if (result) return currentValue;
    
    // Down right diagonal
    result = this.checkBoardInDirection(row,col,1,1);
    if (result) return currentValue;
    
    return 0; // No winner
  }
  
  gameOver = () => {
    // Check if the board is full
    // TODO: Check if its impossible to win and end the game
    for (var row = 0; row < this.state.rowCount; row++) {
    	for (var col = 0; row < this.state.colCount; col++) {
      	if (this.state.slotValues[row][col] === 0) {
        	return false;
        }
      }
    }
    debugger;
    return true;
  }
  
  colClicked = (col) => {
  	if (this.state.currentPlayer <= 0)
    	return; // Game over: nobody won
    if (this.state.winner > 0)
    	return; // Game over: somebody won
    
  	// Find the lowest slot which has no piece
    var rowNumber = -1;
    for (var row = this.state.rowCount-1; row>=0; row--) {
    	if (this.state.slotValues[row][col] === 0) {
				rowNumber = row;
        break;
      }
    }
    if (rowNumber >= 0) {
      var newSlotValues = this.state.slotValues;
      newSlotValues[rowNumber][col] = this.state.currentPlayer;

      // Set the slot transition values for animating the piece dropping down the board
      var newSlotTransitions = Game.createEmptyBoard(Constants.defaultRows,Constants.defaultColumns, null);
      for (var i = 0; i <= rowNumber; i++) {
        var newSlotTransition = this.state.currentPlayer + '-' + i;
        if (i === rowNumber) {
          newSlotTransition = newSlotTransition + '-final';
        }
        newSlotTransitions[i][col] = newSlotTransition;
      }

      var winner = this.findWinner(row, col);
      var newPlayer = this.state.currentPlayer;
      if (winner > 0) {
      	// console.log('Player ' + winner + ' has won the game!')
      }
      else {
      	if (this.gameOver()) {
        	newPlayer = -1; // Indicates game over
        }
				else {
          // Switch turns
          if (this.state.currentPlayer === 1) {
            newPlayer = 2;
          }
          else {
            newPlayer = 1;
          }
        }
      }
      
      this.setState({
        slotValues: newSlotValues,
        slotTransitions: newSlotTransitions,
        currentPlayer: newPlayer,
        winner: winner,
      });
      // console.log('Setting row ' + i + ', col ' + col + ' to player ' + this.state.currentPlayer);
    }
  };

  constructor(props) {
    super(props);
    this.state = Game.initialState();
  }

	render() {
  	return (
    	<div>
        <Board slotValues={this.state.slotValues} slotTransitions={this.state.slotTransitions} colClicked={this.colClicked} />
        <GameStatus currentPlayer={this.state.currentPlayer} onRestartClicked={() => this.restartGame()} winner={this.state.winner} />
      </div>
    );
  }
}
