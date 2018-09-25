import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import createSagaMiddleware from 'redux-saga';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <App />
  </Provider>,
  document.getElementById('app')
);
