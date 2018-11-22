import * as React from 'react';
import { ActionTypes, InputEvent } from '../types';
interface Props {
    secperhour: number;
    actions: ActionTypes;
    maxsecperhour?: number;
    min?: number;
    id?: string;
    className?: string;
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
