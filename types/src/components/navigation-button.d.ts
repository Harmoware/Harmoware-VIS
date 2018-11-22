import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    buttonType: string;
    actions: ActionTypes;
    viewport: {
        zoom?: number;
        minZoom?: number;
        maxZoom?: number;
        distance?: number;
        minDistance?: number;
        maxDistance?: number;
        bearing?: number;
    };
    className?: string;
}
export default class NavigationButton extends React.Component<Props> {
    static defaultProps: {
        className: string;
    };
    setViewport(argument: Object): void;
    render(): JSX.Element;
}
export {};
