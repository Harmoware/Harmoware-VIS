import * as React from 'react';
import { BasedProps as Props } from '../types';
export default class Root extends React.Component<Props> {
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    animationFrame: number;
    animate(): void;
    resize(): void;
}
