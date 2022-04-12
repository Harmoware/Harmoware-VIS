/// <reference types="react" />
import { ActionTypes } from '../types';
interface Props {
    secperhour?: number;
    multiplySpeed?: number;
    actions: ActionTypes;
    maxsecperhour?: number;
    maxmultiplySpeed?: number;
    min?: number;
    id?: string;
    className?: string;
}
declare const SpeedValue: {
    (props: Props): JSX.Element;
    defaultProps: {
        maxsecperhour: number;
        maxmultiplySpeed: number;
        min: number;
        className: string;
    };
};
export default SpeedValue;
