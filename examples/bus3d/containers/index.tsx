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

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Bus3dAppProps extends Bus3dProps {
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
    actions.initializeFetch('datalist.json');
    actions.setMovesOptionFunc(getBusOptionValue);
    actions.setDepotsOptionFunc(getBusstopOptionValue);
    this.state = {
      iconChange: false,
      optionChange: false,
      archLayerChange: false,
      arcdata: []
    };
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
    const { actions, settime, xbandCellSize, answer, xbandFname } = nextProps;
    actions.updateRainfall(settime, xbandCellSize, answer, xbandFname);
    return { arcdata: updateArcLayerData(nextProps) };
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
        actions.updateRoute([el], true);
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
            viewport={viewport}
            actions={actions}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            layers={[
              rainfall.length > 0 ?
              new XbandmeshLayer({
                rainfall,
                layerCellSize: xbandCellSize
              }):null,
              depotsData.length > 0 ?
              new DepotsLayer({
                depotsData,
                optionElevationScale: elevationScale,
                optionVisible: 'busstopsoption' in busoption,
                optionChange: this.state.optionChange,
                onHover,
                onClick: onClickBusstop
              }):null,
              movedData.length > 0 ? 
              new MovesLayer({
                routePaths,
                movedData,
                movesbase,
                clickedObject,
                actions,
                optionElevationScale: elevationScale,
                optionVisible: 'busmovesoption' in busoption,
                optionChange: this.state.optionChange,
                iconChange: this.state.iconChange,
                onHover,
                onClick: onClickBus
              }):null,
              !this.state.archLayerChange ?
              new Bus3dArcLayer({
                data: this.state.arcdata,
                visible: !this.state.archLayerChange,
                onHover
              }):null
            ]}
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
