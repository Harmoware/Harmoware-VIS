/// <reference types="react" />
import { ActionTypes } from '../types';
interface Props {
    settime: number;
    timeBegin: number;
    timeLength: number;
    min?: number;
    actions: ActionTypes;
    id?: string;
    className?: string;
}
declare const ElapsedTimeValue: {
    (props: Props): JSX.Element;
    defaultProps: {
        min: number;
        className: string;
    };
};
export default ElapsedTimeValue;
