import { render } from 'react-dom';
import { getCombinedReducer } from 'harmoware-vis';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './containers';
import '../../scss/harmoware.scss';
import './scss/visualize-sample.scss';
var store = createStore(getCombinedReducer());
render(React.createElement(Provider, { store: store },
    React.createElement(App, null)), document.getElementById('app'));
//# sourceMappingURL=index.js.map