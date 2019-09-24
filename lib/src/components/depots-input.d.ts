import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    i18n?: {
        formatError: string;
    };
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class DepotsInput extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            formatError: string;
        };
    };
    onSelect(e: React.ChangeEvent<HTMLInputElement>): void;
    onClick(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export {};
