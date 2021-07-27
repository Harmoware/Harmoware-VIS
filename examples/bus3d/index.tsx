import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import createSagaMiddleware from 'redux-saga';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/I18n';
import rootSaga from './sagas';
import App from './containers';
import reducer from './reducers';
import '../../scss/harmoware.scss';
import './scss/bus3d.scss';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('app')
);
