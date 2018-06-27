import { render } from 'react-dom';
import { reducer } from 'harmoware-vis';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import App from './containers';

const store = createStore(combineReducers({ ...reducer }));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
