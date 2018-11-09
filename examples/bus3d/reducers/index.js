import { getCombinedReducer } from 'harmoware-vis';
import controller from './controller';
import data from './data';
import bus3d from './bus3d';
export default getCombinedReducer({ controller: controller, data: data, bus3d: bus3d });
//# sourceMappingURL=index.js.map