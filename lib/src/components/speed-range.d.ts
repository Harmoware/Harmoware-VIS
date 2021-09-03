import * as React from 'react';
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
export default class SpeedRange extends React.Component<Props> {
    static defaultProps: {
        maxsecperhour: number;
        maxmultiplySpeed: number;
        min: number;
        step: number;
        className: string;
    };
    setSecPerHour(e: React.ChangeEvent<HTMLInputElement>): void;
    setMultiplySpeed(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export {};
