import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    children?: React.ReactNode;
    i18n?: {
        pauseButtonCaption: string;
    };
    className?: string;
    title?: string;
}
export default class PauseButton extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            pauseButtonCaption: string;
        };
        className: string;
    };
    setAnimatePause(): void;
    render(): JSX.Element;
}
export {};
