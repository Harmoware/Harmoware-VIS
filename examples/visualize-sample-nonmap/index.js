import { render } from 'react-dom';
import { reducer } from 'harmoware-vis';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import App from './containers';
import i18n from './locales/I18n';

const store = createStore(combineReducers({ ...reducer }));

render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n} >
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('app')
);
