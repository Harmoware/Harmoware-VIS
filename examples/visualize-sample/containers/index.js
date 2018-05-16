// @flow

import React from 'react';
import type { Component } from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers, XbandmeshLayer,
  connectToHarmowareVis } from 'harmoware-vis';
import type { BasedProps as Props, InputEvent } from 'harmoware-vis';

import Controller from '../components/controller';

const MAPBOX_TOKEN: ? string = process.env.MAPBOX_ACCESS_TOKEN;

type State = {
  moveOptionVisible: boolean,
  depotOptionVisible: boolean,
  optionChange: boolean
}

class App extends Container<Props, State> implements Component {

  props: Props;
  state: State;

  constructor() {
    super();
    this.state = {
      moveOptionVisible: false,
      depotOptionVisible: false,
      optionChange: false,
    };
  }

  getMoveOptionChecked(e: InputEvent) {
    this.setState({ moveOptionVisible: e.target.checked });
  }

  getDepotOptionChecked(e: InputEvent) {
    this.setState({ depotOptionVisible: e.target.checked });
  }

  getOptionChangeChecked(e: InputEvent) {
    this.setState({ optionChange: e.target.checked });
  }

  render() {
    const props = this.props;
    const {
      actions, rainfall, lightSettings, routePaths, viewport,
      clickedObject, movesbase, movedData, depotsData } = props;

    return (
      <div>
        <Controller
          {...props}
          getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
          getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
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
              }),
              new DepotsLayer({
                depotsData,
                lightSettings,
                optionVisible: this.state.depotOptionVisible,
                optionChange: this.state.optionChange,
              }),
              new MovesLayer({
                routePaths,
                movesbase,
                movedData,
                clickedObject,
                actions,
                lightSettings,
                optionVisible: this.state.moveOptionVisible,
                optionChange: this.state.optionChange,
              })
            ]}
          />
        </div>
      </div>
    );
  }
}

export default connectToHarmowareVis(App);
