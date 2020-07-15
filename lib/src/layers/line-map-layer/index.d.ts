import { LineLayer, PathLayer, PolygonLayer } from '@deck.gl/layers';
import { LayerProps, CompositeLayer } from '@deck.gl/core';
import { LineMapData } from '../../types';
interface Props extends LayerProps {
    data?: LineMapData[];
    getSourcePosition?: (x: LineMapData) => number[];
    getTargetPosition?: (x: LineMapData) => number[];
    getPath?: (x: LineMapData) => number[];
    getPolygon?: (x: LineMapData) => number[];
    getCoordinates?: (x: LineMapData) => number[];
    getElevation?: (x: LineMapData) => number[];
    getColor?: (x: LineMapData) => number[];
    getWidth?: (x: LineMapData) => number;
    getDashArray?: (x: LineMapData) => number[];
    widthUnits?: string;
    widthMinPixels?: number;
    polygonOpacity?: number;
    lineOpacity?: number;
}
export default class LineMapLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static defaultProps: {
        id: string;
        pickable: boolean;
        getSourcePosition: (x: LineMapData) => number[];
        getTargetPosition: (x: LineMapData) => number[];
        getPath: (x: LineMapData) => number[];
        getPolygon: (x: LineMapData) => number[];
        getCoordinates: (x: LineMapData) => number[];
        getElevation: (x: LineMapData) => number[] | 3;
        getWidth: (x: LineMapData) => number;
        getColor: (x: LineMapData) => number[];
        getDashArray: (x: LineMapData) => number[];
        widthUnits: string;
        widthMinPixels: number;
        polygonOpacity: number;
        lineOpacity: number;
    };
    static layerName: string;
    renderLayers(): (PolygonLayer<{
        id: string;
        data: LineMapData[];
        visible: true;
        opacity: number;
        pickable: boolean;
        extruded: boolean;
        wireframe: boolean;
        getPolygon: (x: LineMapData) => number[];
        getFillColor: (x: LineMapData) => number[];
        getLineColor: any;
        getElevation: (x: LineMapData) => number[];
    }, {}> | PathLayer<{
        id: string;
        data: LineMapData[];
        visible: true;
        opacity: number;
        pickable: boolean;
        widthUnits: string;
        widthMinPixels: number;
        rounded: boolean;
        getPath: (x: LineMapData) => number[];
        getColor: (x: LineMapData) => number[];
        getWidth: (x: LineMapData) => number;
        getDashArray: (x: LineMapData) => number[];
    }, {}> | LineLayer<{
        id: string;
        data: LineMapData[];
        visible: true;
        opacity: number;
        pickable: boolean;
        getSourcePosition: (x: LineMapData) => number[];
        getTargetPosition: (x: LineMapData) => number[];
        getColor: (x: LineMapData) => number[];
        getWidth: (x: LineMapData) => number;
        widthUnits: string;
        widthMinPixels: number;
    }, {}>)[];
}
export {};
