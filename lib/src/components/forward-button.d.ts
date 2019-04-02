import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    children?: React.ReactNode;
    i18n?: {
        forwardButtonCaption: string;
    };
    className?: string;
}
export default class ForwardButton extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            forwardButtonCaption: string;
        };
    };
    setAnimateReverse(): void;
    render(): JSX.Element;
}
export {};
