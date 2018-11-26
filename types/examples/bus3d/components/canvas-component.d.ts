import * as React from 'react';
interface Props {
    width?: number;
    height?: number;
    updateCanvas?: Function;
}
export default class CanvasComponent extends React.Component<Props> {
    canvas: any;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentDidUpdate(): void;
    updateCanvas(): void;
    render(): JSX.Element;
}
export {};
