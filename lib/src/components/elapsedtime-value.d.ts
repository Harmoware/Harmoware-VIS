/// <reference types="react" />
import { ActionsInterface } from '../types';
interface Props {
    settime: number;
    timeBegin: number;
    timeLength: number;
    min?: number;
    actions: ActionsInterface;
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
