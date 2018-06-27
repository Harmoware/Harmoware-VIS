// @flow

import React from 'react';
import type { Component } from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesNonmapLayer, FixedPointLayer, LineMapLayer, HarmoVisNonMapLayers,
  connectToHarmowareVis } from 'harmoware-vis';
import type { BasedProps as Props, InputEvent } from 'harmoware-vis';

import Controller from '../components/controller';

class App extends Container<Props> implements Component {

  props: Props;

  render() {
    const props = this.props;
    const { actions, viewport, movedData, movesbase, depotsData,
      linemapData, routePaths, clickedObject } = props;
    let dispLookAt = '';

    if (viewport.lookAt) {
      dispLookAt = viewport.lookAt.join(',');
    }

    return (
      <div>
        <Controller
          {...props}
        />
        <div id="footer_area">
          サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。&nbsp;
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html">リンク</a>&nbsp;
          lookAt:{dispLookAt}&nbsp;
          distance:{viewport.distance}&nbsp;
          rotationX:{viewport.rotationX}&nbsp;
          rotationY:{viewport.rotationY}&nbsp;
          fov:{viewport.fov}
          <FPSStats isActive />
        </div>
        <div className="gallery-wrapper">
          <HarmoVisNonMapLayers
            viewport={viewport}
            actions={actions}
            layers={[
              new FixedPointLayer({
                depotsData
              }),
              new MovesNonmapLayer({
                movedData, movesbase, actions, routePaths, clickedObject
              }),
              new LineMapLayer({
                linemapData
              })
            ]}
          />
        </div>
      </div>
    );
  }
}

export default connectToHarmowareVis(App);
