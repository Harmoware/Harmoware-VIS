import { LayerProps, CompositeLayer, PolygonLayer } from 'deck.gl';
import { LightSettings } from '../../types';
interface Props extends LayerProps {
    filled?: boolean;
    stroked?: boolean;
    extruded?: boolean;
    wireframe?: boolean;
    elevationScale?: number;
    lineWidthMinPixels?: number;
    cellSize?: number;
    getPosition?: (x: any) => number[];
    getElevation?: (x: any) => number | number;
    getColor?: (x: any) => number[] | number[];
    getLineWidth?: (x: any) => number | number;
    getVertexAngle?: (x: any) => number;
    lightSettings: LightSettings;
}
export default class PolygonIconLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static defaultProps: {
        filled: boolean;
        stroked: boolean;
        pickable: boolean;
        extruded: boolean;
        wireframe: boolean;
        lineWidthMinPixels: number;
        cellSize: number;
        getPosition: (x: any) => any;
        getElevation: number;
        getColor: number[];
        getLineWidth: number;
        getVertexAngle: () => number;
        lightSettings: {};
    };
    static layerName: string;
    renderLayers(): PolygonLayer<{
        id: string;
        data: any[];
        pickable: boolean;
        stroked: boolean;
        extruded: boolean;
        filled: boolean;
        wireframe: boolean;
        opacity: number;
        lineWidthMinPixels: number;
        getPolygon: (x: any) => any;
        getElevation: (x: any) => number;
        getFillColor: (x: any) => number[];
        getLineColor: (x: any) => number[];
        getLineWidth: (x: any) => number;
        lightSettings: LightSettings;
    }, {}>[];
}
export {};
