import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { applyDefaultStyle } from 'harmoware-vis';
import rootSaga from './sagas';
import App from './containers';
import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
applyDefaultStyle(); // Set 'style' tag to 'head' tag.

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
