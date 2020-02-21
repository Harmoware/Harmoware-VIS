import * as React from 'react';
import { BasedProps as Props } from '../types';
export default class Container<P extends Props, S = {}> extends React.Component<P, S> {
    constructor(props: P);
    componentDidMount(): void;
    componentWillUnmount(): void;
    animationFrame: number;
    animate(): void;
    resize(): void;
}
