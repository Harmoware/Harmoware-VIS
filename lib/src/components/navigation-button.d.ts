import * as React from 'react';
import { ActionTypes, Viewport } from '../types';
interface Props {
    buttonType: string;
    actions: ActionTypes;
    viewport: Viewport;
    className?: string;
    title?: string;
}
export default class NavigationButton extends React.Component<Props> {
    static defaultProps: {
        className: string;
    };
    setViewport(argument: Viewport): void;
    setDefaultViewport(): void;
    render(): JSX.Element;
}
export {};
