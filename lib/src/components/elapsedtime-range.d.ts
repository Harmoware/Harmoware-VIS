/// <reference types="react" />
import { ActionsInterface } from '../types';
interface Props {
    settime: number;
    timeBegin: number;
    timeLength: number;
    min?: number;
    step?: number;
    actions: ActionsInterface;
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
