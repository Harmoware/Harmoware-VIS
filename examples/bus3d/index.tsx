import { render } from 'react-dom';
import { getConfigureStore } from 'harmoware-vis';
import { Provider } from 'react-redux';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/I18n';
import App from './containers';
import bus3dReducers from './reducers';
import '../../scss/harmoware.scss';
import './scss/bus3d.scss';

const store = getConfigureStore(bus3dReducers);

render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('app')
);
