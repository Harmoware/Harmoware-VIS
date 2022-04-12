/// <reference types="react" />
import { ActionTypes } from '../types';
interface Props {
    settime: number;
    timeBegin: number;
    timeLength: number;
    min?: number;
    step?: number;
    actions: ActionTypes;
    id?: string;
    className?: string;
    title?: string;
}
declare const ElapsedTimeRange: {
    (props: Props): JSX.Element;
    defaultProps: {
        min: number;
        step: number;
        className: string;
    };
};
export default ElapsedTimeRange;
