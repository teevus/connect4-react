import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board';

it('renders without crashing', () => {
  const div = document.createElement('div');
  var slotValues = [[0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0]]; 
  var slotTransitions =  [[null,null,null,null,null,null,null], 
                          [null,null,null,null,null,null,null],
                          [null,null,null,null,null,null,null],
                          [null,null,null,null,null,null,null],
                          [null,null,null,null,null,null,null],
                          [null,null,null,null,null,null,null]];
  ReactDOM.render(<Board slotValues={slotValues} slotTransitions={slotTransitions} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
