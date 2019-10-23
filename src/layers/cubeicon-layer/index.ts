import { LayerProps, GridCellLayer } from 'deck.gl';

const DEFAULT_COLOR = [255, 255, 255, 255];

interface Props extends LayerProps {
  cellSize?: number,
  coverage?: number,
  elevationScale?: number,
  extruded?: boolean,
  material?: object,
  getPosition?: (x: any) => number[],
  getColor?: (x: any) => number[],
  getFillColor?: (x: any) => number[],
  getLineColor?: (x: any) => number[],
  getHeight?: (x: any) => number,
}
export default class CubeiconLayer extends GridCellLayer<Props> {

  constructor(props: Props) {
    super(Object.assign({}, props ,{getElevation: props.getHeight, offset: [0,0]}) );
  }

  static defaultProps = {
    getHeight: (x: any) => x.height, // height:height
    getFillColor: (x: any) => x.color || DEFAULT_COLOR,
    getLineColor: (x: any) => x.color || DEFAULT_COLOR,
    getColor: {deprecatedFor: ['getFillColor', 'getLineColor']}
  };

  static layerName = 'CubeiconLayer';
}
