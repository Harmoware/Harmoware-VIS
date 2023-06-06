import * as React from 'react';
import { Bus3dProps as Props, Arcdata, Bus3dEventInfo } from '../types';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers,
  connectToHarmowareVis, LoadingIcon, FpsDisplay } from 'harmoware-vis';
import { withTranslation } from 'react-i18next';
import XbandmeshLayer from '../layers/xbandmesh-layer';
import Bus3dArcLayer from '../layers/bus3d-arc-layer';
import Header from '../components/header';
import Controller from '../components/controller';
import InteractionLayer from '../components/interaction-layer';
import * as moreActions from '../actions';
import { getBusOptionValue, getBusstopOptionValue, updateArcLayerData } from '../library';
import { initializeFetch, updateRoute, updateRainfall } from '../sagas'

import {registerLoaders} from '@loaders.gl/core';
import {OBJLoader} from '@loaders.gl/obj';
registerLoaders([OBJLoader]);
const busmesh = '../icon/bus.obj';
const busstopmesh = '../icon/busstop.obj';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

export interface State {
  iconChange: boolean,
  optionChange: boolean,
  archLayerChange: boolean,
  arcdata: Arcdata[]
}
const initState:State = {
  iconChange: false,
  optionChange: false,
  archLayerChange: false,
  arcdata: []
}

const App = (props:Props)=>{
  const {
    actions, settime, elevationScale, selectedBusstop, rainfall, t,
    routePaths, xbandCellSize, viewport, hovered, clickedObject,
    busoption, movedData, movesbase, depotsData, loading } = props

  const [state,setState] = React.useState<State>(initState)
  const { iconChange, optionChange, archLayerChange, arcdata } = state

  React.useEffect(()=>{
    actions.setDefaultViewport({defaultZoom:12.6})
    actions.setViewport({
      longitude:136.2028714130227,latitude:35.9574951366151,zoom:12.6
    })
    actions.setMovesOptionFunc(getBusOptionValue)
    actions.setDepotsOptionFunc(getBusstopOptionValue)
    initializeFetch(actions,'datalist.json')
  },[])

  React.useEffect(()=>{
    updateRainfall(props)
    setState({...state, arcdata:updateArcLayerData(props)})
  },[props])

  const getIconChangeChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({...state, iconChange:e.target.checked})
  }

  const getOptionChangeChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({...state, optionChange:e.target.checked})
  }

  const getArchLayerChangeChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({...state, archLayerChange:e.target.checked});
  }

  const onHover = (event: Bus3dEventInfo) => actions.setHovered(event);

  const onClickBus = (el: Bus3dEventInfo) => {
    const { movesbaseidx, code } = el.object
    if (clickedObject && clickedObject[0].object.movesbaseidx === movesbaseidx) {
      actions.setClicked(null)
      actions.setRoutePaths([])
    } else {
      updateRoute([el] as any[], true, props)
      actions.setSelectedBus(code)
    }
  }

  const onClickBusstop = (el: Bus3dEventInfo) => {
    const { code } = el.object
    if (selectedBusstop.length > 0 && selectedBusstop === code) {
      actions.setSelectedBusstop('')
    } else {
      actions.setSelectedBusstop(code)
    }
  }

  const date = settime * 1000

  return (
    <Container<Props> {...props}>
      <Header {...props} />
      <Controller
        {...props} date={date}
        getIconChangeChecked={getIconChangeChecked}
        getOptionChangeChecked={getOptionChangeChecked}
        getArchLayerChangeChecked={getArchLayerChangeChecked}
        state={state}
      />
      <div className="harmovis_footer">
        <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
          {t('permission')}</a>
        {` longitude:${viewport.longitude} latitude:${viewport.latitude} zoom:${viewport.zoom} bearing:${viewport.bearing} pitch:${viewport.pitch}`}
      </div>
      <div className="harmovis_area">
        <HarmoVisLayers
          viewport={viewport}
          actions={actions}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          layers={[].concat(
            rainfall.length > 0 ?
            new XbandmeshLayer({
              rainfall,
              layerCellSize: xbandCellSize
            }):null,
            depotsData.length > 0 ?
            new DepotsLayer({
              depotsData,
              optionElevationScale: elevationScale,
              optionCentering: false,
              optionVisible: 'busstopsoption' in busoption,
              optionChange,
              iconChange,
              onHover,
              onClick: onClickBusstop,
              mesh:busstopmesh
            }):null,
            movedData.length > 0 ?
            new MovesLayer({
              routePaths,
              movedData,
              movesbase,
              clickedObject,
              actions,
              optionElevationScale: elevationScale,
              optionCentering: !iconChange,
              optionVisible: 'busmovesoption' in busoption,
              optionChange,
              iconChange,
              onHover,
              onClick: onClickBus,
              mesh:busmesh
            }):null,
            !archLayerChange && arcdata.length > 0 ?
            new Bus3dArcLayer({
              data: arcdata,
              visible: !archLayerChange,
            }):null
          )}
        />
        <InteractionLayer viewport={viewport} hovered={hovered} />
        <LoadingIcon loading={loading} />
        <FpsDisplay />
      </div>
    </Container>
  )
}
export default connectToHarmowareVis(withTranslation()(App), moreActions);
