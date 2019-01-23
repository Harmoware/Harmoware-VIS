import { LayerProps, GridCellLayer, CompositeLayer } from 'deck.gl';
import { LightSettings } from 'harmoware-vis';
import { RainfallData } from '../../types';
interface Props extends LayerProps {
    rainfall: RainfallData[];
    layerOpacity?: number;
    layerCellSize?: number;
    layerElevationScale?: number;
    lightSettings: LightSettings;
    getElevation?: (x: RainfallData) => number;
    getColor?: (x: RainfallData) => number[];
    getRainfallColor?: (x: number) => number[];
    defaultColor?: number[];
}
export default class XbandmeshLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static defaultProps: {
        layerOpacity: number;
        layerCellSize: number;
        layerElevationScale: number;
        getElevation: (x: RainfallData) => number;
        getColor: (x: RainfallData) => number[];
        getRainfallColor: (x: number) => number[];
        defaultColor: number[];
    };
    static layerName: string;
    renderLayers(): GridCellLayer<{
        id: string;
        data: RainfallData[];
        getElevation: (x: RainfallData) => number;
        getColor: (x: RainfallData) => number[];
        opacity: number;
        cellSize: number;
        elevationScale: number;
        lightSettings: LightSettings;
        pickable: true;
    }, {}>[];
}
export {};
