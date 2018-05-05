import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Game from './Game/Game';

class App extends React.Component {

	render() {
  	return (
    	<div>
      	<Game />
        <br/>
      </div>
    );
  }
}

export default App;
