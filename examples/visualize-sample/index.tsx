import { render } from 'react-dom';
import { getConfigureStore } from 'harmoware-vis';
import { Provider } from 'react-redux';
import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import App from './containers';
import '../../scss/harmoware.scss';
import './scss/visualize-sample.scss';

const store = getConfigureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
