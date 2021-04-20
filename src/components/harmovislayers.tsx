import * as React from 'react';
import InteractiveMap, { FlyToInterpolator, TransitionInterpolator } from 'react-map-gl';
import type { TRANSITION_EVENTS } from 'react-map-gl';
import { Layer } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {MapController} from '@deck.gl/core';
import { ActionTypes, Viewport } from '../types';

type InteractiveMapProps = any;
type FlyToInterpolatorProps = any;

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
  flytoArgument?: FlyToInterpolatorProps,
  transitionDuration?: number | 'auto'
  transitionInterpolator?: TransitionInterpolator,
  transitionInterruption?: typeof TRANSITION_EVENTS,
}
interface State {
  transition?: boolean,
}

const MapGl = (props:InteractiveMapProps) => {
  const {mapboxAddLayerValue, ...otherProps} = props;
  const [execflg, setFlg] = React.useState(false);
  const [prevStyle, setStyle] = React.useState(props.mapStyle);
  const interactiveMapRef = React.useRef(null);
  const map = interactiveMapRef.current && interactiveMapRef.current.getMap();

  if(map && !execflg && mapboxAddLayerValue){
    setFlg(true);
    map.on('load', function() {
      for(const LayerValuemapElement of mapboxAddLayerValue){
        if(!map.getLayer(LayerValuemapElement.id)){
          map.addLayer(LayerValuemapElement);
        }
      }
    });
  }
  if(prevStyle !== props.mapStyle){
    setStyle(props.mapStyle);
    if(map && mapboxAddLayerValue){
      map.on('styledata', function() {
        for(const LayerValuemapElement of mapboxAddLayerValue){
          if(!map.getLayer(LayerValuemapElement.id)){
            map.addLayer(LayerValuemapElement);
          }
        }
      });
    }
  }
  return (<InteractiveMap {...otherProps} ref={interactiveMapRef} />);
};

export default class HarmoVisLayers extends React.Component<Props,State> {
  static defaultProps = {
    visible: true,
    mapStyle: 'mapbox://styles/mapbox/dark-v8',
    mapGlComponents: null,
    mapboxAddLayerValue: [{
      "id": "3d-buildings",
      "source": "composite",
      "source-layer": "building",
      "filter": ["==", "extrude", "true"],
      "type": "fill-extrusion",
      "paint": {
          "fill-extrusion-color": "#888",
          "fill-extrusion-height": [
              "interpolate", ["linear"], ["zoom"],
              5, 0, 5.05, ["get", "height"] ],
          "fill-extrusion-base": [
              "interpolate", ["linear"], ["zoom"],
              5, 0, 5.05, ["get", "min_height"] ],
          "fill-extrusion-opacity": .6
      },
    }],
    flytoArgument: null,
    transitionDuration: undefined,
    transitionInterpolator: undefined,
    transitionInterruption: undefined,
  }
  constructor(props: Props){
    super(props);
    this.state = {transition:false};
  }

  componentDidUpdate(prevProps:Props) {
    if (!this.state.transition) {
      this.setState({transition:true});
    }
    const {transitionDuration} = this.props.viewport;
    if(transitionDuration !== prevProps.viewport.transitionDuration){
      if(transitionDuration !== undefined){
        this.props.actions.setViewport({
          transitionDuration:undefined,
          transitionInterpolator:undefined });
      }
    }
  }

  initialize(gl: WebGLRenderingContext) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const { props } = this;
    const { actions, visible, viewport, mapStyle, mapboxApiAccessToken,
      layers, mapGlComponents, flytoArgument, mapboxAddLayerValue } = props;
    const onViewportChange = props.onViewportChange||actions.setViewport;
    const transitionDuration = this.state.transition?
      (viewport.transitionDuration||props.transitionDuration):undefined;
    const transitionInterpolator = viewport.transitionInterpolator||
      props.transitionInterpolator||new FlyToInterpolator(flytoArgument);
    const transitionInterruption = viewport.transitionInterruption||
      props.transitionInterruption;

    if(visible){
      return (
        <MapGl
          {...(viewport as InteractiveMapProps)}
          mapStyle={mapStyle}
          onViewportChange={onViewportChange}
          mapboxApiAccessToken={mapboxApiAccessToken}
          visible={visible}
          transitionDuration={transitionDuration}
          transitionInterpolator={transitionInterpolator}
          transitionInterruption={transitionInterruption}
          mapboxAddLayerValue={mapboxAddLayerValue}
        >
          { mapGlComponents }
          <DeckGL viewState={viewport} layers={layers} onWebGLInitialized={this.initialize} />
        </MapGl>
      );
    }else{
      const viewState = {...viewport, transitionDuration, transitionInterpolator, transitionInterruption};
      return (
        <DeckGL
          controller={{type: MapController}}
          onViewStateChange={(v:any)=>onViewportChange(v.viewState)}
          viewState={viewState}
          layers={layers}
          onWebGLInitialized={this.initialize} />
      );
    }
  }
}
