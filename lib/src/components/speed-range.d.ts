/// <reference types="react" />
import { ActionTypes } from '../types';
interface Props {
    secperhour?: number;
    multiplySpeed?: number;
    actions: ActionTypes;
    maxsecperhour?: number;
    maxmultiplySpeed?: number;
    min?: number;
    step?: number;
    id?: string;
    className?: string;
    title?: string;
}
declare const SpeedRange: {
    (props: Props): JSX.Element;
    defaultProps: {
        maxsecperhour: number;
        maxmultiplySpeed: number;
        min: number;
        step: number;
        className: string;
    };
};
export default SpeedRange;
