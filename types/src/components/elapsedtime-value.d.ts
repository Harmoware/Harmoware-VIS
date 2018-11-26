import * as React from 'react';
import { ActionTypes, InputEvent } from '../types';
interface Props {
    settime: number;
    timeLength: number;
    min?: number;
    actions: ActionTypes;
    id?: string;
    className?: string;
}
export default class ElapsedTimeValue extends React.Component<Props> {
    static defaultProps: {
        min: number;
        className: string;
    };
    setTime(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
