import * as React from 'react';
import { Bus3dProps, Arcdata, Bus3dEventInfo } from '../types';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers,
  connectToHarmowareVis, LoadingIcon, FpsDisplay } from 'harmoware-vis';
import { withTranslation, WithTranslation } from 'react-i18next';
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

interface Bus3dAppProps extends Required<Bus3dProps> {
  t: (key: string) => string,
}

interface State {
  iconChange: boolean,
  optionChange: boolean,
  archLayerChange: boolean,
  arcdata: Arcdata[]
}

class App extends Container<Bus3dAppProps & WithTranslation, State> {

  constructor(props: Bus3dAppProps & WithTranslation) {
    super(props);
    const { actions } = props;
    this.state = {
      iconChange: false,
      optionChange: false,
      archLayerChange: false,
      arcdata: []
    };
  }

  componentDidMount(){
    super.componentDidMount();
    this.props.actions.setViewport({
      longitude:136.2028714130227,latitude:35.9574951366151,zoom:11.1
    });
  }

  getIconChangeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ iconChange: e.target.checked });
  }

  getOptionChangeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ optionChange: e.target.checked });
  }

  getArchLayerChangeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ archLayerChange: e.target.checked });
  }

  static getDerivedStateFromProps(nextProps: Bus3dAppProps, prevState: State) {
    updateRainfall(nextProps);
    return { arcdata: updateArcLayerData(nextProps) };
  }
  onLoad(){
    console.log('onLoad')
    const {actions} = this.props
    actions.setMovesOptionFunc(getBusOptionValue);
    actions.setDepotsOptionFunc(getBusstopOptionValue);
    initializeFetch(actions,'datalist.json');
  }

  render() {
    const props = this.props;
    const {
      actions, settime, elevationScale, selectedBusstop, rainfall, t,
      routePaths, xbandCellSize, viewport, hovered, clickedObject,
      busoption, movedData, movesbase, depotsData, loading } = props;

    const onHover = (event: Bus3dEventInfo) => actions.setHovered(event);
    const onClickBus = (el: Bus3dEventInfo) => {
      const { movesbaseidx, code } = el.object;
      if (clickedObject && clickedObject[0].object.movesbaseidx === movesbaseidx) {
        actions.setClicked(null);
        actions.setRoutePaths([]);
      } else {
        updateRoute([el] as any[], true, props);
        actions.setSelectedBus(code);
      }
    };
    const onClickBusstop = (el: Bus3dEventInfo) => {
      const { code } = el.object;
      if (selectedBusstop.length > 0 && selectedBusstop === code) {
        actions.setSelectedBusstop('');
      } else {
        actions.setSelectedBusstop(code);
      }
    };
    const date = settime * 1000;

    return (
      <div>
        <Header {...props} />
        <Controller
          {...props} date={date}
          getIconChangeChecked={this.getIconChangeChecked.bind(this)}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
          getArchLayerChangeChecked={this.getArchLayerChangeChecked.bind(this)}
        />
        <div className="harmovis_footer">
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
            {t('permission')}</a>&nbsp;
          longitude:{viewport.longitude}&nbsp;
          latitude:{viewport.latitude}&nbsp;
          zoom:{viewport.zoom}&nbsp;
          bearing:{viewport.bearing}&nbsp;
          pitch:{viewport.pitch}
        </div>
        <div className="harmovis_area">
          <HarmoVisLayers
            deckGLProps={{onLoad:this.onLoad.bind(this)}}
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
                optionChange: this.state.optionChange,
                iconChange: this.state.iconChange,
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
                optionCentering: !this.state.iconChange,
                optionVisible: 'busmovesoption' in busoption,
                optionChange: this.state.optionChange,
                iconChange: this.state.iconChange,
                onHover,
                onClick: onClickBus,
                mesh:busmesh
              }):null,
              !this.state.archLayerChange && this.state.arcdata.length > 0 ?
              new Bus3dArcLayer({
                data: this.state.arcdata,
                visible: !this.state.archLayerChange,
              }):null
            )}
          />
          <InteractionLayer viewport={viewport} hovered={hovered} />
          <LoadingIcon loading={loading} />
          <FpsDisplay />
        </div>
      </div>
    );
  }
}

export default connectToHarmowareVis(withTranslation()(App), moreActions);
