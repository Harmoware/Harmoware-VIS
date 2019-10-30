import { LayerProps, GridCellLayer } from 'deck.gl';
import { PhongMaterial } from '@luma.gl/core';

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
    const { getColor, getFillColor, getLineColor, ...otherProps } = props;
    super(Object.assign({}, otherProps ,{
      getFillColor: getFillColor || getColor,
      getLineColor: getLineColor || getColor,
      getElevation: props.getHeight,
      offset: [0,0]}) );
  }

  static defaultProps = {
    getHeight: (x: any) => x.height, // height:height
    getColor: (x: any) => x.color || DEFAULT_COLOR,
    material: new PhongMaterial({
      ambient: 0.4,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [30, 30, 30]
    })
  };

  static layerName = 'CubeiconLayer';
}
