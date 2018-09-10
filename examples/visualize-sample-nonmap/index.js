import { render } from 'react-dom';
import { getCombinedReducer, applyDefaultStyle } from 'harmoware-vis';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import App from './containers';
import i18n from './locales/I18n';

const store = createStore(getCombinedReducer());
applyDefaultStyle(); // Set 'style' tag to 'head' tag.

render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n} >
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('app')
);
