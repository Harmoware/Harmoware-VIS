// @flow

import React from 'react';
import type { Component } from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesNonmapLayer, FixedPointLayer, LineMapLayer, HarmoVisNonMapLayers,
  connectToHarmowareVis } from 'harmoware-vis';
import type { BasedProps, InputEvent } from 'harmoware-vis';
import { translate } from 'react-i18next';

import Controller from '../components/controller';

type State = {
  popup: Array<any>
}

type Props = { t: Function } & BasedProps

class App extends Container<Props, State> implements Component {

  props: Props;
  state: State;

  constructor() {
    super();
    this.state = {
      popup: [0, 0, '']
    };
  }

  render() {
    const props = this.props;
    const { actions, viewport, movedData, movesbase, depotsData,
      linemapData, routePaths, clickedObject, t } = props;
    let dispLookAt = '';

    if (viewport.lookAt) {
      dispLookAt = viewport.lookAt.join(',');
    }

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
        <Controller
          {...props}
        />
        <div id="footer_area">
          {t('permission')}&nbsp;
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html">
            {t('link')}</a>&nbsp;
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
                depotsData, onHover
              }),
              new MovesNonmapLayer({
                movedData, movesbase, actions, routePaths, clickedObject, onHover
              }),
              new LineMapLayer({
                linemapData, onHover
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
      </div>
    );
  }
}

export default connectToHarmowareVis(translate()(App));
