import React from 'react';
import PropTypes from 'prop-types';
import ColumnButton from './ColumnButton';
import Slot from './Slot';

export default class Board extends React.Component {
    static propTypes = {
      colClicked: PropTypes.func.isRequired,
      slotValues: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      slotTransitions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    };
  
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
                <ColumnButton key={j} col={j} colClicked={this.props.colClicked} />
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