import { combineReducers } from 'redux';
import { getCombinedReducer } from 'harmoware-vis';
import controller from './controller';
import data from './data';
import bus3d from './bus3d';

export default getCombinedReducer({ controller, data, bus3d });
