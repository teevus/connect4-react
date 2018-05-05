import React from 'react';
import PropTypes from 'prop-types';

export default class ColumnButton extends React.Component {
    static propTypes = {
      col: PropTypes.number.isRequired,
      colClicked: PropTypes.func.isRequired,
    };
  
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