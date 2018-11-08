import { render } from 'react-dom';
import { getCombinedReducer } from 'harmoware-vis';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './containers';
import '../../scss/harmoware.scss';
import './scss/visualize-sample.scss';

const store = createStore(getCombinedReducer());

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
