import { getCombinedReducer } from 'harmoware-vis';
import bus3d from './bus3d';

export const bus3dReducers:object = { bus3d }
export default getCombinedReducer(bus3dReducers);
