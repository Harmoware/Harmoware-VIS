/// <reference types="react" />
import { ActionsInterface } from '../types';
interface Props {
    secperhour?: number;
    multiplySpeed?: number;
    actions: ActionsInterface;
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
