import React from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers, XbandmeshLayer,
  Actions, connectToHarmowareVis } from 'harmoware-vis';
import Header from '../components/Header';
import Controller from '../components/Controller';
import InteractionLayer from '../components/interaction-layer';
import * as moreActions from '../actions';
import { getBusOptionValue, getBusstopOptionValue, getContainerProp } from '../library';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

class App extends Container {

  constructor(props) {
    super(props);
    const { actions } = props;
    actions.initializeFetch('datalist.json');
    actions.setMovesOptionFunc(getBusOptionValue);
    actions.setDepotsOptionFunc(getBusstopOptionValue);
    this.state = {
      optionChange: false,
    };
  }

  getOptionChangeChecked(e) {
    this.setState({ optionChange: e.target.checked });
  }

  componentWillReceiveProps(nextProps) {
    const { actions, settime, timeBegin, xbandCellSize, answer, xbandFname } = nextProps;
    actions.updateRainfall(settime, timeBegin, xbandCellSize, answer, xbandFname);
  }

  render() {
    const props = this.props;
    const {
      actions, settime, timeBegin, elevationScale, selectedBusstop, rainfall,
      lightSettings, routePaths, xbandCellSize, viewport, hovered, clickedObject,
      busoption, movesbase, movedData, depotsData } = props;

    let busstopsoption = {};
    if (Object.keys(busoption).length > 0 && busoption.busstopsoption) {
      busstopsoption = busoption.busstopsoption;
    }

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
          busstopsoption={busstopsoption}
        />
        <Controller
          {...props} date={date}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
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
