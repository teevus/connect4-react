import React from 'react';
import ReactDOM from 'react-dom';
import Slot from './Slot';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Slot />, div);
  ReactDOM.unmountComponentAtNode(div);
});
