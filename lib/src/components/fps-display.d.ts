import * as React from 'react';
interface Props {
    width?: number;
    height?: number;
    colorCode?: string;
    className?: string;
    UnitCaption?: string;
}
interface State {
    saveTime: number;
    frameCounterArray: number[];
    fpsRate: number;
}
export default class FpsDisplay extends React.Component<Props, State> {
    constructor(props: Props);
    canvas: HTMLCanvasElement;
    static frameCounter: number;
    static defaultProps: {
        width: number;
        height: number;
        colorCode: string;
        className: string;
        UnitCaption: string;
    };
    static getDerivedStateFromProps(nextProps: Props, prevState: State): {
        saveTime: number;
        frameCounterArray: number[];
        fpsRate: number;
    };
    componentDidUpdate(prevProps: Props, prevState: State): void;
    render(): JSX.Element;
}
export {};
