import * as React from 'react';
import { ActionTypes, InputEvent } from '../types';
interface Props {
    actions: ActionTypes;
    i18n?: {
        formatError: string;
    };
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class LinemapInput extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            formatError: string;
        };
    };
    onSelect(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
