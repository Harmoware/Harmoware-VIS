import { Bus3dEventInfo } from '../types';
interface Action {
    type: string;
    height: number;
    delayrange: number;
    elevation: number;
    xbandCellSize: number;
    name: string;
    xbandFname: string;
    busstop: string;
    selectedBus: string;
    answer: string;
    hovered: Bus3dEventInfo;
}
declare const _default: (state: {
    delayheight: number;
    delayrange: number;
    elevationScale: number;
    xbandCellSize: number;
    bsoptFname: string;
    xbandFname: string;
    selectedBusstop: string;
    selectedBus: string;
    answer: string;
    hovered: Bus3dEventInfo;
}, action: Action) => {
    delayheight: number;
    delayrange: number;
    elevationScale: number;
    xbandCellSize: number;
    bsoptFname: string;
    xbandFname: string;
    selectedBusstop: string;
    selectedBus: string;
    answer: string;
    hovered: Bus3dEventInfo;
};
export default _default;
