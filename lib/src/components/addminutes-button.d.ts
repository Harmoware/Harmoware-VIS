import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    addMinutes?: number;
    children?: React.ReactNode;
    actions: ActionTypes;
    i18n?: {
        minutesCaption: string;
    };
    className?: string;
    title?: string;
}
export default class AddMinutesButton extends React.Component<Props> {
    static defaultProps: {
        addMinutes: number;
        i18n: {
            minutesCaption: string;
        };
        className: string;
    };
    addMinutes(minutes: number): void;
    render(): JSX.Element;
}
export {};
