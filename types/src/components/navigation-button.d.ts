import * as React from 'react';
import { setViewport } from '../actions';
interface Props {
    buttonType: string;
    actions: {
        setViewport: typeof setViewport;
    };
    viewport: {
        zoom: number;
        minZoom: number;
        maxZoom: number;
        distance: number;
        minDistance: number;
        maxDistance: number;
        bearing: number;
    };
    className: string;
}
export default class NavigationButton extends React.Component<Props> {
    static defaultProps: {
        className: string;
    };
    setViewport(argument: Object): void;
    render(): JSX.Element;
}
export {};
