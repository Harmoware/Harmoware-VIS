import * as React from 'react';
import { addMinutes } from '../actions';
declare type addMinutesType = typeof addMinutes;
interface Props {
    addMinutes: number;
    children?: Element;
    actions: {
        addMinutes: addMinutesType;
    };
    i18n: {
        minutesCaption: string;
    };
    className: string;
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
