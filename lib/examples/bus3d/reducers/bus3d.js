import * as types from '../constants/action-types';
var initialState = {
    bustripscsv: [],
    busstopscsv: [],
    busroutes: {}
};
export default (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case types.SETBUSTRIPSCSV:
            return (function () {
                var bustripscsv = action.bustripscsv;
                return Object.assign({}, state, {
                    bustripscsv: bustripscsv
                });
            })();
        case types.SETBUSSTOPSCSV:
            return (function () {
                var busstopscsv = action.busstopscsv;
                return Object.assign({}, state, {
                    busstopscsv: busstopscsv
                });
            })();
        case types.SETBUSROUTES:
            return (function () {
                var busroutes = action.routes;
                return Object.assign({}, state, {
                    busroutes: busroutes
                });
            })();
        default:
            return state;
    }
});
//# sourceMappingURL=bus3d.js.map