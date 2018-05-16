import { combineReducers } from 'redux';
import { reducer } from 'harmoware-vis';
import controller from './controller';
import data from './data';
import bus3d from './bus3d';

export default combineReducers({ ...reducer, controller, data, bus3d });
