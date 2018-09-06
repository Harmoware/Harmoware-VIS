import { render } from 'react-dom';
import { getCombinedReducer, applyDefaultStyle } from 'harmoware-vis';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import App from './containers';

const store = createStore(getCombinedReducer());
applyDefaultStyle();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
