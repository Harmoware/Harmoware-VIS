import { LayerProps, GridCellLayer, CompositeLayer } from 'deck.gl';
interface Props extends LayerProps {
    cellSize?: number;
    coverage?: number;
    elevationScale?: number;
    extruded?: boolean;
    material?: object;
    getPosition?: (x: any) => number[];
    getColor?: (x: any) => number[][];
    getElevation?: (x: any) => number[];
    getRadius?: (x: any) => number;
    stacking1?: boolean;
    stacking2?: boolean;
}
export default class CubeGraphLayer extends CompositeLayer<Props> {
    static defaultProps: Props;
    static layerName: string;
    renderLayers(): GridCellLayer<{
        id: string;
        data: any[];
        pickable: boolean;
        opacity: number;
        cellSize: number;
        elevationScale: number;
        getPosition: (x: any) => any;
        getElevation: (x: any) => any;
        getFillColor: (x: any) => any;
        offset: number[];
    }, {}>;
}
export {};
