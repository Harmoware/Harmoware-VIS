import { render } from 'react-dom';
import { getCombinedReducer } from 'harmoware-vis';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './containers';
import i18n from './locales/I18n';
import '../../scss/harmoware.scss';
import './scss/visualize-sample-nonmap.scss';

const store = createStore(getCombinedReducer());

render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n} >
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('app')
);
