import * as React from 'react';
import { BasedProps } from '../types';
declare class Container<P extends BasedProps, S = {}> extends React.Component<P, S> {
    constructor(props: P);
    componentDidMount(): void;
    componentWillUnmount(): void;
    animationFrame: number;
    animate(): void;
    resize(): void;
    render(): JSX.Element;
}
export default Container;
