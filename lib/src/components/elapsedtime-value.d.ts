import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    settime: number;
    timeBegin: number;
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
    setTime(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export {};
