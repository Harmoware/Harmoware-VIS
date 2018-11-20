import * as React from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers,
  connectToHarmowareVis, settings, LoadingIcon, Actions, types } from 'harmoware-vis';
import DepotsArcLayer from '../layers/depots-arc-layer';
import XbandmeshLayer from '../layers/xbandmesh-layer';
import Header from '../components/header';
import Controller from '../components/controller';
import InteractionLayer from '../components/interaction-layer';
import * as moreActions from '../actions';
import { getBusOptionValue, getBusstopOptionValue, updateArcLayerData } from '../library';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const { COLOR1 } = settings;

interface State {
  optionChange: boolean,
  archLayerChange: boolean,
  arcdata: any,
}

interface Props extends types.BasedProps {
  elevationScale: number,
  selectedBusstop: any,
  rainfall: any,
  xbandCellSize: any,
  hovered: any,
  busoption: any,
}

class App extends Container<Props, State> {

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
      busoption, movesbase, movedData, depotsData, loading } = props;

    const state = this.state;

    const onHover = el => actions.setHovered(el);
    const onClickBus = (el) => {
      const { movesbaseidx, code } = el.object;
      if (clickedObject && clickedObject[0].object.movesbaseidx === movesbaseidx) {
        actions.setClicked(null);
        actions.setRoutePaths([]);
      } else {
        actions.updateRoute([el], true);
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
        />
        <Controller
          {...props} date={date}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
          getArchLayerChangeChecked={this.getArchLayerChangeChecked.bind(this)}
        />
        <div className="harmovis_footer">
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
            サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。</a>&nbsp;
          longitude:{viewport.longitude}&nbsp;
          latitude:{viewport.latitude}&nbsp;
          zoom:{viewport.zoom}&nbsp;
          bearing:{viewport.bearing}&nbsp;
          pitch:{viewport.pitch}
          <FPSStats isActive />
        </div>
        <div className="harmovis_area">
          <HarmoVisLayers
            viewport={viewport}
            actions={actions as any}
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
                optionVisible: 'busstopsoption' in busoption,
                optionChange: state.optionChange,
                onHover,
                onClick: onClickBusstop
              }),
              new MovesLayer({
                routePaths,
                movesbase,
                movedData,
                clickedObject,
                actions: actions as any,
                lightSettings,
                optionElevationScale: elevationScale,
                optionVisible: 'busmovesoption' in busoption,
                optionChange: state.optionChange,
                onHover,
                onClick: onClickBus
              }),
              new DepotsArcLayer({
                id: 'arch-layer',
                data: state.arcdata,
                visible: !state.archLayerChange,
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
          <LoadingIcon loading={loading} />
        </div>
      </div>
    );
  }
}

export default connectToHarmowareVis(App, moreActions);
