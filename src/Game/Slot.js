import React from 'react';
import PropTypes from 'prop-types';

export default class Slot extends React.Component {
    static propTypes = {
      slotValue: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
      colClicked: PropTypes.func.isRequired,
    };
  
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