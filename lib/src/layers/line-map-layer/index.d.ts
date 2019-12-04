import { LayerProps, CompositeLayer, LineLayer, PathLayer, PolygonLayer } from 'deck.gl';
import { LineData } from '../../types';
interface Props extends LayerProps {
    getSourcePosition?: (x: any) => number[];
    getTargetPosition?: (x: any) => number[];
    getPath?: (x: any) => number[];
    getPolygon?: (x: any) => number[];
    getCoordinates?: (x: any) => number[];
    getElevation?: (x: any) => number[];
    getColor?: (x: any) => number[];
    getWidth?: (x: any) => number;
    getDashArray?: (x: any) => number[];
    widthUnits?: string;
    widthMinPixels?: number;
    polygonOpacity?: number;
    lineOpacity?: number;
}
export default class LineMapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        id: string;
        pickable: boolean;
        getSourcePosition: (x: LineData) => number[];
        getTargetPosition: (x: LineData) => number[];
        getPath: (x: any) => any;
        getPolygon: (x: any) => any;
        getCoordinates: (x: any) => any;
        getElevation: (x: any) => any;
        getWidth: (x: any) => any;
        getColor: (x: LineData) => number[];
        getDashArray: (x: any) => any;
        widthUnits: string;
        widthMinPixels: number;
        polygonOpacity: number;
        lineOpacity: number;
    };
    static layerName: string;
    renderLayers(): (PolygonLayer<{
        id: string;
        data: any[];
        visible: true;
        opacity: number;
        pickable: boolean;
        extruded: boolean;
        wireframe: boolean;
        getPolygon: (x: any) => number[];
        getFillColor: (x: any) => number[];
        getLineColor: any;
        getElevation: (x: any) => number[];
    }, {}> | PathLayer<{
        id: string;
        data: any[];
        visible: true;
        opacity: number;
        pickable: boolean;
        widthUnits: string;
        widthMinPixels: number;
        rounded: boolean;
        getPath: (x: any) => number[];
        getColor: (x: any) => number[];
        getWidth: (x: any) => number;
        getDashArray: (x: any) => number[];
    }, {}> | LineLayer<{
        id: string;
        data: any[];
        visible: true;
        opacity: number;
        pickable: boolean;
        getSourcePosition: (x: any) => number[];
        getTargetPosition: (x: any) => number[];
        getColor: (x: any) => number[];
        getWidth: (x: any) => number;
        widthUnits: string;
        widthMinPixels: number;
    }, {}>)[];
}
export {};
