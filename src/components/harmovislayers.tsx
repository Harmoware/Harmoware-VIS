import * as React from 'react';
import InteractiveMap from 'react-map-gl';
import { Layer } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {MapController} from '@deck.gl/core';
import { ActionTypes, Viewport } from '../types';

type InteractiveMapProps = Parameters<typeof InteractiveMap>[0];

interface Props extends Omit<InteractiveMapProps,"transitionDuration">{
  viewport : Viewport,
  actions: ActionTypes,
  layers: Layer[],
  mapGlComponents?: any
  mapboxAddLayerValue?: mapboxgl.Layer[],
  terrain?: boolean,
  terrainSource?: {id:string,source:object},
  setTerrain?: {source:string,exaggeration?:number},
  transitionDuration?: number | 'auto'
}
interface State {
  transition?: boolean,
}

const MapGl = (props:Partial<Props>) => {
  const {mapboxAddLayerValue, terrain, terrainSource, setTerrain, ...otherProps} = props;
  const [execflg, setFlg] = React.useState(false);
  const [prevStyle, setStyle] = React.useState(props.mapStyle);
  const interactiveMapRef = React.useRef(null);
  const map = interactiveMapRef.current && interactiveMapRef.current.getMap();

  if(map && !execflg && (mapboxAddLayerValue || terrain)){
    setFlg(true);
    map.on('load', function() {
      if(mapboxAddLayerValue){
        for(const LayerValuemapElement of mapboxAddLayerValue){
          if(!map.getLayer(LayerValuemapElement.id)){
            map.addLayer(LayerValuemapElement);
          }
        }
      }
      if(terrain){
        map.addSource(terrainSource.id, terrainSource.source);
        map.setTerrain(setTerrain);
      }
    });
  }
  if(prevStyle !== props.mapStyle){
    setStyle(props.mapStyle);
    if(map && (mapboxAddLayerValue || terrain)){
      map.on('styledata', function() {
        if(mapboxAddLayerValue){
          for(const LayerValuemapElement of mapboxAddLayerValue){
            if(!map.getLayer(LayerValuemapElement.id)){
              map.addLayer(LayerValuemapElement);
            }
          }
        }
        if(terrain){
          map.addSource(terrainSource.id, terrainSource.source);
          map.setTerrain(setTerrain);
        }
      });
    }
  }
  return (<InteractiveMap {...otherProps as any} ref={interactiveMapRef} />);
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
    terrain: false,
    terrainSource: {id:'mapbox-dem',source:{
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    }},
    setTerrain: {source:'mapbox-dem'},
    transitionDuration: 0,
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
      if(transitionDuration !== 0){
        this.props.actions.setViewport({
          transitionDuration:0,
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
      layers, mapGlComponents, mapboxAddLayerValue,
      terrain, terrainSource, setTerrain } = props;
    const onViewportChange = props.onViewportChange||actions.setViewport;
    const transitionDuration = this.state.transition?
      (viewport.transitionDuration||props.transitionDuration):0;
    const transitionInterpolator = viewport.transitionInterpolator||
      props.transitionInterpolator;
    const transitionInterruption = viewport.transitionInterruption||
      props.transitionInterruption;

    if(visible){
      return (
        <MapGl
          {...viewport}
          mapStyle={mapStyle}
          onViewportChange={onViewportChange}
          mapboxApiAccessToken={mapboxApiAccessToken}
          visible={visible}
          transitionDuration={transitionDuration}
          transitionInterpolator={transitionInterpolator}
          transitionInterruption={transitionInterruption}
          mapboxAddLayerValue={mapboxAddLayerValue}
          terrain={terrain}
          terrainSource={terrainSource}
          setTerrain={setTerrain}
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
