import * as React from 'react';
import { Container, MovesNonmapLayer, FixedPointLayer, LineMapLayer2, HarmoVisNonMapLayers,
  connectToHarmowareVis, LoadingIcon, BasedProps, Viewport, EventInfo, FpsDisplay } from 'harmoware-vis';
import { translate } from 'react-i18next';
import Controller from '../components/controller';

interface Props extends BasedProps {
  t: (key: string) => string,
  viewport: Viewport,
}
interface State {
  popup: [number, number, string]
}

class App extends Container<Props, State> implements React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      popup: [0, 0, '']
    };
  }

  render() {
    const props = this.props;
    const { actions, viewport, movedData, movesbase, depotsData,
      linemapData, routePaths, clickedObject, t, loading } = props;
    let dispLookAt = '';

    if (viewport.lookAt) {
      dispLookAt = viewport.lookAt.join(',');
    }

    const onHover = (el: EventInfo) => {
      if (el && el.object) {
        let disptext = '';
        const objctlist = Object.entries(el.object);
        for (let i = 0, lengthi = objctlist.length; i < lengthi; i += 1) {
          const strvalue = objctlist[i][1].toString();
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
        <div className="harmovis_footer">
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
            {t('permission')}</a>&nbsp;
          lookAt:{dispLookAt}&nbsp;
          distance:{viewport.distance}&nbsp;
          rotationX:{viewport.rotationX}&nbsp;
          rotationY:{viewport.rotationY}&nbsp;
          fov:{viewport.fov}
        </div>
        <div className="harmovis_area">
          <HarmoVisNonMapLayers
            viewport={viewport}
            actions={actions}
            layers={[
              new FixedPointLayer({
                depotsData,
                onHover,
              }),
              new MovesNonmapLayer({
                movedData,
                movesbase,
                actions,
                routePaths,
                clickedObject,
                onHover,
              }),
              new LineMapLayer2({
                linemapData,
                onHover,
              })
            ]}
          />
        </div>
        <svg width={viewport.width} height={viewport.height} className="harmovis_overlay">
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
        <FpsDisplay />
      </div>
    );
  }
}

export default connectToHarmowareVis(translate()(App));
