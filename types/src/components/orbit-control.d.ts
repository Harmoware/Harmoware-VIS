import * as React from 'react';
import { PerspectiveViewport } from 'deck.gl';
import { Viewport } from '../types';
interface customViewport extends Viewport {
    isDragging?: boolean;
}
interface Props extends customViewport {
    children?: JSX.Element;
    ref?: (canvas: any) => void;
    onViewportChange?: (customViewport: any) => void;
}
export default class OrbitController extends React.Component<Props> {
    dragStartPos: null | [number, number];
    static getViewport(viewport: Viewport): PerspectiveViewport;
    constructor(props: any);
    static defaultProps: {
        lookAt: number[];
        rotationX: number;
        rotationY: number;
        minDistance: number;
        maxDistance: number;
        fov: number;
    };
    onDragStart(evt: any): void;
    onDrag(evt: any): void;
    onDragEnd(): void;
    onWheel(evt: any): void;
    render(): JSX.Element;
}
export {};
