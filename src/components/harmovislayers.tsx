import * as React from 'react';
import InteractiveMap, { InteractiveMapProps } from 'react-map-gl';
import { Layer } from '@deck.gl/core';
import DeckGL, { FlyToInterpolator, FlyToProps } from 'deck.gl';
import { ActionTypes, Viewport } from '../types';

interface Props {
  visible?: boolean,
  viewport : Viewport,
  mapboxApiAccessToken: string,
  mapStyle?: string,
  actions: ActionTypes,
  onViewportChange?(viewport: Viewport): void,
  layers: Layer[],
  mapGlComponents?: any
  mapboxAddLayerValue?: mapboxgl.Layer[],
  flyto?: boolean,
  flytoArgument?: FlyToProps,
  transitionDuration?: number | 'auto'
}
interface State {
  flyto?: boolean,
}

class MapGl extends InteractiveMap {
  static mapboxAddLayerValue: mapboxgl.Layer[];

  componentDidMount() {
    super.componentDidMount();
    if(!MapGl.mapboxAddLayerValue) return;
    const map = this.getMap();
    const LayerValuemap = MapGl.mapboxAddLayerValue;
    map.on('load', function() {
      for(const LayerValuemapElement of LayerValuemap){
        map.addLayer(LayerValuemapElement);
      }
    });
  }
  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>) {
    super.componentDidUpdate(prevProps, prevState);
    if(prevProps.mapStyle !== this.props.mapStyle && prevProps.mapStyle === '') {
      if(!MapGl.mapboxAddLayerValue) return;
      const map = this.getMap();
      const LayerValuemap = MapGl.mapboxAddLayerValue;
      let execflg = false
      map.on('styledata', function() {
        if(execflg) return;
        for(const LayerValuemapElement of LayerValuemap){
          map.addLayer(LayerValuemapElement);
        }
        execflg = true;
      });
    }
  }
}

export default class HarmoVisLayers extends React.Component<Props,State> {
  static defaultProps = {
    visible: true,
    mapStyle: 'mapbox://styles/mapbox/dark-v8',
    mapGlComponents: null,
    mapboxAddLayerValue: [{
      "id": '3d-buildings',
      "source": 'composite',
      "source-layer": 'building',
      "filter": ['==', 'extrude', 'true'],
      "type": 'fill-extrusion',
      "paint": {
          "fill-extrusion-color": '#888',
          "fill-extrusion-height": [
              "interpolate", ["linear"], ["zoom"],
              5, 0, 5.05, ["get", "height"] ],
          "fill-extrusion-base": [
              "interpolate", ["linear"], ["zoom"],
              5, 0, 5.05, ["get", "min_height"] ],
          "fill-extrusion-opacity": .6
      },
    }],
    flyto: false,
    flytoArgument: null,
    transitionDuration: undefined
  }
  constructor(props: Props){
    super(props);
    this.state = {flyto:false};
    this.transitionDuration = undefined;
    MapGl.mapboxAddLayerValue = props.mapboxAddLayerValue;
  }

  componentDidUpdate(prevProps:Props) {
    if (this.state.flyto !== this.props.flyto) {
      this.setState({flyto:this.props.flyto});
      const {flyto,transitionDuration:tran} = this.props;
      this.transitionDuration = flyto ? (tran ? tran:'auto'):undefined
    }
    if(this.props.viewport.transitionDuration !== prevProps.viewport.transitionDuration){
      if(this.props.viewport.transitionDuration !== undefined){
        this.props.actions.setViewport({transitionDuration:undefined});
      }
    }
  }

  initialize(gl: WebGLRenderingContext) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  onViewportChange(viewState:Viewport):void{
    const {actions,transitionDuration:tran} = this.props;
    const {flyto} = this.state; //必要！
    this.transitionDuration = undefined;
    actions.setViewport(viewState);
    this.transitionDuration = flyto ? (tran ? tran:'auto'):undefined
  }
  transitionDuration:(number|'auto');

  render() {
    const { visible, viewport, mapStyle, mapboxApiAccessToken,
      layers, mapGlComponents, flytoArgument } = this.props;
    const onViewportChange = this.props.onViewportChange || this.onViewportChange.bind(this);
    const transitionDuration = viewport.transitionDuration || this.transitionDuration;
    const transitionInterpolator = viewport.transitionInterpolator || new FlyToInterpolator(flytoArgument);

    return (
      <MapGl
        {...(viewport as InteractiveMapProps)}
        mapStyle={mapStyle}
        onViewportChange={onViewportChange}
        mapboxApiAccessToken={mapboxApiAccessToken}
        visible={visible}
        transitionDuration={transitionDuration}
        transitionInterpolator={transitionInterpolator}
        transitionInterruption={viewport.transitionInterruption}
      >
        { mapGlComponents }
        <DeckGL viewState={viewport} layers={layers} onWebGLInitialized={this.initialize} />
      </MapGl>
    );
  }
}
