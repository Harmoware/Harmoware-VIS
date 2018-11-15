import * as React from 'react';
import { setSecPerHour } from '../actions';
import { InputEvent } from '../types';
interface Props {
    secperhour: number;
    actions: {
        setSecPerHour: typeof setSecPerHour;
    };
    maxsecperhour: number;
    min: number;
    id: string;
    className: string;
}
export default class SpeedValue extends React.Component<Props> {
    static defaultProps: {
        maxsecperhour: number;
        min: number;
        className: string;
    };
    setSecPerHour(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
