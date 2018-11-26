import * as React from 'react';
import { ActionTypes, InputEvent } from '../types';
interface Props {
    settime: number;
    timeLength: number;
    min?: number;
    step?: number;
    actions: ActionTypes;
    id?: string;
    className?: string;
}
export default class ElapsedTimeRange extends React.Component<Props> {
    static defaultProps: {
        min: number;
        step: number;
        className: string;
    };
    setTime(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
