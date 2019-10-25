import { LayerProps, GridCellLayer } from 'deck.gl';
interface Props extends LayerProps {
    cellSize?: number;
    coverage?: number;
    elevationScale?: number;
    extruded?: boolean;
    material?: object;
    getPosition?: (x: any) => number[];
    getColor?: (x: any) => number[];
    getFillColor?: (x: any) => number[];
    getLineColor?: (x: any) => number[];
    getHeight?: (x: any) => number;
}
export default class CubeiconLayer extends GridCellLayer<Props> {
    constructor(props: Props);
    static defaultProps: {
        getHeight: (x: any) => any;
        getFillColor: (x: any) => any;
        getLineColor: (x: any) => any;
        getColor: {
            deprecatedFor: string[];
        };
    };
    static layerName: string;
}
export {};
