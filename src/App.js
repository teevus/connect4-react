import React from 'react';
import './App.css';

const colors = ['','Red','Yellow'];

class Slot extends React.Component {
	onClicked = () => {
  	if (this.props.col === null)
    	return;
      
    if (this.props.slotValue !== 0) {
    	return;  // Already has a piece
    }
    this.props.colClicked(this.props.col)
  }

	render() {
    var slotClass = 'slot slot-' + this.props.slotValue;
    if (this.props.slotTransition !== null) {
      slotClass = slotClass + ' slottransition-' + this.props.slotTransition;
    }
    return (
        <div className={slotClass} onClick={this.onClicked}></div>
    );
  }
}

class ColButton extends React.Component {
	onClicked = () => {
  	if (this.props.col === null)
      return;
      
    this.props.colClicked(this.props.col)
  }

	render() {
    return (
    <div className="colButton" onClick={this.onClicked} >
    <i className="fa fa-arrow-down"></i>
    </div>
    );
  }
}

class Board extends React.Component {
  
	render() {
    var cols = new Array(7);
    for (var i=0;i<cols.length;i++) {
      cols[i] = i;
    }
    var rows = new Array(6);
    for (var j=0;j<rows.length;j++) {
      rows[j] = j;
    }
  	return (
    <div className="game">
        <div className="frame">
        	<div className="board">
          	<div key={-1} className="row board-row">
              {cols.map(j =>
              <ColButton key={j} col={j} colClicked={this.props.colClicked} />
              )}
            </div>
            {rows.map(i =>
              <div key={i} className="row board-row">
                {cols.map(j =>
                <Slot key={j} slotValue={this.props.slotValues[i][j]} col={j} slotTransition={this.props.slotTransitions[i][j]} colClicked={this.props.colClicked} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const GameStatus = (props) => {
  if (props.winner > 0) {
    return (
    		<div>
        	<p>Player {props.currentPlayer} ({colors[props.currentPlayer]}) has won the game!</p>
        	<button onClick={props.onRestartClicked}>Restart Game</button>
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
    	<p>Player {props.currentPlayer} ({colors[props.currentPlayer]}) turn</p>
    );
  }
}

class Game extends React.Component {
	static defaultRows = 6;
  static defaultCols = 7;
  
  restartGame = () => {
  	// console.log('restart clicked')
  	this.setState(Game.initialState);
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
      var newSlotTransitions = Game.createEmptyBoard(Game.defaultRows,Game.defaultCols, null);
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

  static initialState = () => ({
  	rowCount: Game.defaultRows,
    colCount: Game.defaultCols,
    slotValues: Game.createEmptyBoard(Game.defaultRows,Game.defaultCols, 0),
    slotTransitions: Game.createEmptyBoard(Game.defaultRows,Game.defaultCols, null),
    player1: '', // ETH address
    player2: '',
    currentPlayer: 1,
    winner: 0
  });
  state = Game.initialState();

	render() {
  	return (
    	<div>
      	<h3>Connect 4</h3>
        <hr/>
        <br/>
        <Board slotValues={this.state.slotValues} slotTransitions={this.state.slotTransitions} colClicked={this.colClicked} />
        <GameStatus currentPlayer={this.state.currentPlayer} onRestartClicked={this.restartGame} winner={this.state.winner} />
      </div>
    );
  }
}

class App extends React.Component {
	

	render() {
  	return (
    	<div>
      	<Game />
      </div>
    );
  }
}

export default App;
