// @flow

import { CompositeLayer, COORDINATE_SYSTEM, LineLayer } from 'deck.gl';
import FrontScatterplotLayer from '../front-scatterplot-layer';
import { getClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import type { MovedData, Movesbase, RoutePaths, ClickedObject, Position, DataOption, Radius } from '../../types';
import typeof * as Actions from '../../actions';

type Props = {
  layerOpacity: number,
  movedData: MovedData,
  movesbase: Movesbase,
  getColor: (x: any) => Array<number>,
  getRadius: (x: any) => number,
  routePaths: RoutePaths,
  actions: Actions,
  clickedObject: ClickedObject,
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

  getPickingInfo(pickParams:
    {mode: string, info: {object: {movesbaseidx: number}, layer: {id: string, props: Props}}}) {
    const { mode, info } = pickParams;
    const { object, layer } = info;
    const { id, props } = layer;
    if (mode === 'hover') {
      props.onHover(info);
    }
    if (mode === 'click') {
      if (props.onClick.name !== 'noop') {
        props.onClick(info);
      } else
      if (object && props.actions) {
        const { movesbaseidx } = object;
        const { actions, clickedObject, movesbase } = props;
        const routePaths: RoutePaths = [];
        if (clickedObject && clickedObject.object.movesbaseidx === movesbaseidx) {
          actions.setClicked(null);
        } else {
          actions.setClicked({ object, layer: { id } });
          const { operation } = movesbase[movesbaseidx];
          for (let j = 0; j < (operation.length - 1); j += 1) {
            const { position, color } = operation[j];
            const { position: nextposition } = operation[j + 1];
            routePaths.push({
              sourcePosition: position,
              targetPosition: nextposition,
              color: color || COLOR1
            });
          }
        }
        actions.setRoutePaths(routePaths);
      }
    }
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

    if (getClickedObjectToBeRemoved(movedData, clickedObject)) {
      actions.setRoutePaths([]);
      actions.setClicked(null);
    }

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
