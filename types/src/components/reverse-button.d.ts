import * as React from 'react';
import { setAnimateReverse } from '../actions';
interface Props {
    actions: {
        setAnimateReverse: typeof setAnimateReverse;
    };
    children: Element;
    i18n: {
        reverseButtonCaption: string;
    };
    className: string;
}
export default class ReverseButton extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            reverseButtonCaption: string;
        };
        className: string;
    };
    setAnimateReverse(): void;
    render(): JSX.Element;
}
export {};
