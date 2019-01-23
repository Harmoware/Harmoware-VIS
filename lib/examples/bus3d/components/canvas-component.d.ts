import * as React from 'react';
interface Props {
    width: number;
    height: number;
    updateCanvas: (context: CanvasRenderingContext2D) => void;
}
export default class CanvasComponent extends React.Component<Props> {
    canvas: HTMLCanvasElement;
    componentDidMount(): void;
    updateCanvas(): void;
    render(): JSX.Element;
}
export {};
