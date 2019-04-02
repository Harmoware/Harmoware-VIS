import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    children?: React.ReactNode;
    i18n?: {
        playButtonCaption: string;
    };
    className?: string;
}
export default class PlayButton extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            playButtonCaption: string;
        };
    };
    setAnimatePause(): void;
    render(): JSX.Element;
}
export {};
