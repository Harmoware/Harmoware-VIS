// @flow

import { CompositeLayer, COORDINATE_SYSTEM, LineLayer } from 'deck.gl';
import FrontScatterplotLayer from '../front-scatterplot-layer';
import { onHoverClick, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import type { MovedData, Movesbase, RoutePaths, ClickedObject, Position, DataOption, Radius } from '../../types';
import typeof * as Actions from '../../actions';

type Props = {
  layerOpacity: number,
  movedData: Array<MovedData>,
  movesbase: Array<Movesbase>,
  getColor: (x: any) => Array<number>,
  getRadius: (x: any) => number,
  routePaths: Array<RoutePaths>,
  actions: Actions,
  clickedObject: null | Array<ClickedObject>,
  onHover: Function,
  onClick: Function
}

export default class MovesNonmapLayer extends CompositeLayer<Props> {
  props: Props;

  static defaultProps = {
    layerOpacity: 0.75,
    getColor: (x: DataOption) => x.color || COLOR1
  };

  static layerName = 'MovesNonmapLayer';

  getPickingInfo(pickParams: any) {
    onHoverClick(pickParams);
  }

  renderLayers() {
    const { layerOpacity, actions, clickedObject,
      movedData, getColor, getRadius: propGetRadius,
      routePaths } = this.props;

    if (!movedData) {
      return null;
    }

    const getPosition = (x: Position) => x.position;
    const getRadius = propGetRadius || ((x: Radius) => (x.radius || 2));

    checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);

    return [
      new FrontScatterplotLayer({
        id: 'moves-nonmap',
        data: movedData,
        projectionMode: COORDINATE_SYSTEM.IDENTITY,
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
        projectionMode: COORDINATE_SYSTEM.IDENTITY,
        strokeWidth: 20,
        pickable: false
      }),
    ];
  }
}
