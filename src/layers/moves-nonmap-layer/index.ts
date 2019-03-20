import { LayerProps, CompositeLayer, COORDINATE_SYSTEM, LineLayer } from 'deck.gl';
import FrontScatterplotLayer from '../front-scatterplot-layer';
import { onHoverClick, pickParams, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { MovedData, Movesbase, RoutePaths, ClickedObject, Position,
  DataOption, Radius, EventInfo } from '../../types';
import * as Actions from '../../actions';

interface Props extends LayerProps {
  layerOpacity?: number,
  movedData: MovedData[],
  movesbase: Movesbase[],
  getColor?: (x) => number[],
  getRadius?: (x) => number,
  routePaths?: RoutePaths[],
  actions: typeof Actions,
  clickedObject?: null | ClickedObject[],
}

export default class MovesNonmapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    layerOpacity: 0.75,
    getColor: (x: DataOption) => x.color || COLOR1,
    getRadius: (x: Radius) => x.radius || 2,
  };

  static layerName = 'MovesNonmapLayer';

  getPickingInfo(pickParams: pickParams) {
    onHoverClick(pickParams);
  }

  renderLayers() {
    const { layerOpacity, actions, clickedObject,
      movedData, getColor, getRadius,
      routePaths } = this.props;

    if (!movedData) {
      return null;
    }

    const getPosition = (x: Position) => x.position;

    checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);

    return [
      new FrontScatterplotLayer({
        id: 'moves-nonmap',
        data: movedData as any[],
        coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
        getPosition,
        getColor,
        getRadius,
        opacity: layerOpacity,
        pickable: true,
        radiusScale: 0.1
      }),
      new LineLayer({
        id: 'route-paths',
        data: routePaths,
        coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
        strokeWidth: 20,
        pickable: false
      }),
    ];
  }
}
