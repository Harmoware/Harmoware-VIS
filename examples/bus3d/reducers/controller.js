import * as types from '../constants/action-types';
var initialState = {
    delayheight: 0,
    delayrange: 10,
    elevationScale: 5,
    xbandCellSize: 0,
    bsoptFname: '',
    xbandFname: '',
    selectedBusstop: '',
    selectedBus: '',
    answer: '',
    hovered: null,
};
export default (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case types.SETDELAYHEIGHT:
            return (function () {
                var delayheight = action.height;
                return Object.assign({}, state, {
                    delayheight: delayheight
                });
            })();
        case types.SETSCALEELEVATION:
            return (function () {
                var elevationScale = action.elevation;
                return Object.assign({}, state, {
                    elevationScale: elevationScale
                });
            })();
        case types.SETCELLSIZE:
            return (function () {
                var xbandCellSize = action.xbandCellSize;
                return Object.assign({}, state, {
                    xbandCellSize: xbandCellSize
                });
            })();
        case types.SETBSOPTFNAME:
            return (function () {
                var bsoptFname = action.name;
                return Object.assign({}, state, {
                    bsoptFname: bsoptFname
                });
            })();
        case types.SETXBANDFNAME:
            return (function () {
                var xbandFname = action.xbandFname;
                return Object.assign({}, state, {
                    xbandFname: xbandFname
                });
            })();
        case types.SETDELAYRANGE:
            return (function () {
                var delayrange = action.delayrange;
                return Object.assign({}, state, {
                    delayrange: delayrange
                });
            })();
        case types.SETANSWER:
            return (function () {
                var answer = action.answer;
                return Object.assign({}, state, {
                    answer: answer
                });
            })();
        case types.SETHOVERED:
            return (function () {
                var hovered = action.hovered;
                return Object.assign({}, state, {
                    hovered: hovered
                });
            })();
        case types.SETSELECTEDBUSSTOP:
            return (function () {
                var selectedBusstop = action.busstop;
                return Object.assign({}, state, {
                    selectedBusstop: selectedBusstop
                });
            })();
        case types.SETSELECTEDBUS:
            return (function () {
                var selectedBus = action.selectedBus;
                return Object.assign({}, state, {
                    selectedBus: selectedBus
                });
            })();
        default:
            return state;
    }
});
//# sourceMappingURL=controller.js.map