import React from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers, XbandmeshLayer,
  Actions, connectToHarmowareVis, settings } from 'harmoware-vis';
import DepotsArcLayer from '../layers/depots-arc-layer';
import Header from '../components/Header';
import Controller from '../components/Controller';
import InteractionLayer from '../components/interaction-layer';
import * as moreActions from '../actions';
import { getBusOptionValue, getBusstopOptionValue, getContainerProp, updateArcLayerData } from '../library';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const { COLOR1 } = settings;

class App extends Container {

  constructor(props) {
    super(props);
    const { actions } = props;
    actions.initializeFetch('datalist.json');
    actions.setMovesOptionFunc(getBusOptionValue);
    actions.setDepotsOptionFunc(getBusstopOptionValue);
    this.state = {
      optionChange: false,
      archLayerChange: false,
      arcdata: []
    };
  }

  getOptionChangeChecked(e) {
    this.setState({ optionChange: e.target.checked });
  }

  getArchLayerChangeChecked(e) {
    this.setState({ archLayerChange: e.target.checked });
  }

  componentWillReceiveProps(nextProps) {
    const { actions, settime, timeBegin, xbandCellSize, answer, xbandFname } = nextProps;
    actions.updateRainfall(settime, timeBegin, xbandCellSize, answer, xbandFname);
    this.setState({ arcdata: updateArcLayerData(nextProps) });
  }

  render() {
    const props = this.props;
    const {
      actions, settime, timeBegin, elevationScale, selectedBusstop, rainfall,
      lightSettings, routePaths, xbandCellSize, viewport, hovered, clickedObject,
      busoption, movesbase, movedData, depotsData } = props;

    const onHover = el => actions.setHovered(el);
    const onClickBus = (el) => {
      const { movesbaseidx, code } = el.object;
      if (clickedObject && clickedObject.object.movesbaseidx === movesbaseidx) {
        actions.setClicked(null);
        actions.setRoutePaths([]);
      } else {
        actions.updateRoute(el, true);
        actions.setSelectedBus(code);
      }
    };
    const onClickBusstop = (el) => {
      const { movesbaseidx, code } = el.object;
      if (selectedBusstop.length > 0 && selectedBusstop === code) {
        actions.setSelectedBusstop('');
      } else {
        actions.setSelectedBusstop(code);
      }
    };
    const date = (timeBegin + settime) * 1000;

    return (
      <div>
        <Header
          {...props} date={date}
          busoption={busoption}
        />
        <Controller
          {...props} date={date}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
          getArchLayerChangeChecked={this.getArchLayerChangeChecked.bind(this)}
        />
        <div id="footer_area">
          サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。&nbsp;
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html">リンク</a>&nbsp;
          longitude:{viewport.longitude}&nbsp;
          latitude:{viewport.latitude}&nbsp;
          zoom:{viewport.zoom}&nbsp;
          bearing:{viewport.bearing}&nbsp;
          pitch:{viewport.pitch}
          <FPSStats isActive />
        </div>
        <div className="gallery-wrapper">
          <HarmoVisLayers
            viewport={viewport}
            actions={actions}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            layers={[
              new XbandmeshLayer({
                lightSettings,
                rainfall,
                layerCellSize: xbandCellSize
              }),
              new DepotsLayer({
                depotsData,
                lightSettings,
                optionElevationScale: elevationScale,
                optionVisible: busoption.busstopsoption,
                optionChange: this.state.optionChange,
                onHover,
                onClick: onClickBusstop
              }),
              new MovesLayer({
                routePaths,
                movesbase,
                movedData,
                clickedObject,
                actions,
                lightSettings,
                optionElevationScale: elevationScale,
                optionVisible: busoption.busmovesoption,
                optionChange: this.state.optionChange,
                onHover,
                onClick: onClickBus
              }),
              new DepotsArcLayer({
                id: 'arch-layer',
                data: this.state.arcdata,
                visible: !this.state.archLayerChange,
                pickable: true,
                getSourcePosition: d => d.sourcePosition,
                getTargetPosition: d => d.targetPosition,
                getSourceColor: d => d.sourceColor || d.color || COLOR1,
                getTargetColor: d => d.targetColor || d.color || COLOR1,
                getStrokeWidths: d => d.strokeWidth || 1,
                onHover
              })
            ]}
          />
          <InteractionLayer viewport={viewport} hovered={hovered} />
        </div>
      </div>
    );
  }
}

export default connectToHarmowareVis(App, moreActions, state => getContainerProp(state));
