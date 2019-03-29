import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    children?: React.ReactNode;
    i18n?: {
        reverseButtonCaption: string;
    };
    className?: string;
}
export default class ReverseButton extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            reverseButtonCaption: string;
        };
    };
    setAnimateReverse(): void;
    render(): JSX.Element;
}
export {};
