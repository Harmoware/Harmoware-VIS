import { GridCellLayer, CompositeLayer } from 'deck.gl';
import { LightSettings } from 'harmoware-vis';
interface Props {
    rainfall: Array<any>;
    layerOpacity?: number;
    layerCellSize?: number;
    layerElevationScale?: number;
    lightSettings: LightSettings;
    getElevation?: (x: any) => number;
    getColor?: (x: any) => Array<number>;
    getRainfallColor?: (x: number) => Array<number>;
    defaultColor?: Array<number>;
}
export default class XbandmeshLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static defaultProps: {
        layerOpacity: number;
        layerCellSize: number;
        layerElevationScale: number;
        getElevation: (x: any) => any;
        getColor: (x: any) => any;
        getRainfallColor: (x: number) => number[];
        defaultColor: number[];
    };
    static layerName: string;
    renderLayers(): GridCellLayer<{
        id: string;
        data: any[];
        getElevation: (x: any) => number;
        getColor: (x: any) => number[];
        opacity: number;
        cellSize: number;
        elevationScale: number;
        lightSettings: LightSettings;
        pickable: boolean;
    }, {}>[];
}
export {};
