import * as types from '../constants/action-types';
var initialState = {
    answers: [],
    busoption: {},
    busmovesbasedic: {},
    routesdata: {},
    bustripindex: {},
    archbase: [],
    rainfall: []
};
export default (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case types.SETANSWERS:
            return (function () {
                var answers = action.answers;
                return Object.assign({}, state, {
                    answers: answers
                });
            })();
        case types.SETBUSOPTION:
            return (function () {
                var busoption = action.option;
                return Object.assign({}, state, {
                    busoption: busoption
                });
            })();
        case types.SETBUSMOVESBASEDIC:
            return (function () {
                var busmovesbasedic = action.dic;
                return Object.assign({}, state, {
                    busmovesbasedic: busmovesbasedic
                });
            })();
        case types.SETROUTESDATA:
            return (function () {
                var routesdata = action.routes;
                return Object.assign({}, state, {
                    routesdata: routesdata
                });
            })();
        case types.SETBUSTRIPINDEX:
            return (function () {
                var bustripindex = action.bustripindex;
                return Object.assign({}, state, {
                    bustripindex: bustripindex
                });
            })();
        case types.SETARCHBASE:
            return (function () {
                var archbase = action.archbase;
                return Object.assign({}, state, {
                    archbase: archbase
                });
            })();
        case types.SETRAINFALL:
            return (function () {
                var rainfall = action.rainfall;
                return Object.assign({}, state, {
                    rainfall: rainfall
                });
            })();
        default:
            return state;
    }
});
//# sourceMappingURL=data.js.map