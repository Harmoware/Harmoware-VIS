import * as React from 'react';
import { PerspectiveViewport } from 'deck.gl';
import { Viewport } from '../types';
interface customViewport extends Viewport {
    isDragging?: boolean;
}
interface Props extends customViewport {
    children?: React.ReactNode;
    ref?: (canvas: any) => void;
    onViewportChange?: (customViewport: any) => void;
}
export default class OrbitController extends React.Component<Props> {
    dragStartPos: null | [number, number];
    static getViewport(viewport: Viewport): PerspectiveViewport;
    constructor(props: Props);
    static defaultProps: {
        lookAt: number[];
        rotationX: number;
        rotationY: number;
        minDistance: number;
        maxDistance: number;
        fov: number;
    };
    onDragStart(evt: React.MouseEvent<HTMLDivElement>): void;
    onDrag(evt: React.MouseEvent<HTMLDivElement>): void;
    onDragEnd(evt: React.MouseEvent<HTMLDivElement>): void;
    onWheel(evt: React.WheelEvent<HTMLDivElement>): void;
    render(): JSX.Element;
}
export {};
