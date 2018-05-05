import React from 'react';
import ReactDOM from 'react-dom';
import ColumnButton from './ColumnButton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ColumnButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});
