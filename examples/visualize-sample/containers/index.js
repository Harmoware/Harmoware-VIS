// @flow

import React from 'react';
import { HexagonLayer } from 'deck.gl';
import type { Component } from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers,
  connectToHarmowareVis, LoadingIcon, styles } from 'harmoware-vis';
import type { BasedProps as Props, InputEvent } from 'harmoware-vis';

import Controller from '../components/controller';

const MAPBOX_TOKEN: ? string = process.env.MAPBOX_ACCESS_TOKEN;

type State = {
  moveOptionVisible: boolean,
  depotOptionVisible: boolean,
  heatmapVisible: boolean,
  optionChange: boolean,
  popup: Array<any>
}

class App extends Container<Props, State> implements Component {
  props: Props;
  state: State;

  constructor() {
    super();
    this.state = {
      moveOptionVisible: false,
      depotOptionVisible: false,
      heatmapVisible: false,
      optionChange: false,
      popup: [0, 0, '']
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

  getHeatmapVisible(e: InputEvent) {
    this.setState({ heatmapVisible: e.target.checked });
  }

  render() {
    const props = this.props;
    const {
      actions, lightSettings, routePaths, viewport, loading,
      clickedObject, movesbase, movedData, depotsData } = props;

    const onHover = (el) => {
      if (el && el.object) {
        let disptext = '';
        const objctlist = Object.entries(el.object);
        for (let i = 0, lengthi = objctlist.length; i < lengthi; i += 1) {
          const strvalue = (objctlist[i][1]: any).toString();
          disptext += i > 0 ? '\n' : '';
          disptext += (`${objctlist[i][0]}: ${strvalue}`);
        }
        this.setState({ popup: [el.x, el.y, disptext] });
      } else {
        this.setState({ popup: [0, 0, ''] });
      }
    };

    return (
      <div>
        <style>{styles}</style>
        <Controller
          {...props}
          getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
          getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
          getHeatmapVisible={this.getHeatmapVisible.bind(this)}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
        />
        <div id="footer_area">
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
            サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。</a>&nbsp;
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
              new DepotsLayer({
                depotsData,
                lightSettings,
                optionVisible: this.state.depotOptionVisible,
                optionChange: this.state.optionChange,
                onHover
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
                onHover
              }),
              new HexagonLayer({
                id: '3d-heatmap',
                data: movedData,
                radius: 100,
                opacity: 0.5,
                extruded: true,
                lightSettings,
                visible: this.state.heatmapVisible
              })
            ]}
          />
        </div>
        <svg width={viewport.width} height={viewport.height} className="svg-overlay">
          <g fill="white" fontSize="12">
            {this.state.popup[2].length > 0 ?
              this.state.popup[2].split('\n').map((value, index) =>
                <text
                  x={this.state.popup[0] + 10} y={this.state.popup[1] + (index * 12)}
                  key={index.toString()}
                >{value}</text>) : null
            }
          </g>
        </svg>
        <LoadingIcon loading={loading} />
      </div>
    );
  }
}

export default connectToHarmowareVis(App);
