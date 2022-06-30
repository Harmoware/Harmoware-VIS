import * as React from 'react';
import InteractiveMap, { InteractiveMapProps, MapLoadEvent } from 'react-map-gl';
import { Layer } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { ActionTypes, Viewport } from '../types';

interface Props extends InteractiveMapProps{
  mapboxApiAccessToken: string,
  viewport : Viewport,
  actions: ActionTypes,
  layers: Layer[],
  mapGlComponents?: any
  mapboxAddLayerValue?: mapboxgl.AnyLayer[],
  mapboxAddSourceValue?: {id:string, source:mapboxgl.AnySourceData}[],
  terrain: boolean,
  terrainSource: {id:string, source:mapboxgl.AnySourceData},
  setTerrain: mapboxgl.TerrainSpecification,
  deckGLProps?:object
}

let gMapGlprops:Partial<Props>;
const MapGl = (props:Partial<Props>) => {
  gMapGlprops = props;
  const [map, setMap] = React.useState<mapboxgl.Map>(undefined);

  const stateUpdate = React.useCallback((map:mapboxgl.Map)=>{
    if(gMapGlprops.mapboxAddLayerValue){
      for(const LayerValuemapElement of gMapGlprops.mapboxAddLayerValue){
        if(!map.getLayer(LayerValuemapElement.id)){
          map.addLayer(LayerValuemapElement);
        }
      }
    }
    if(gMapGlprops.terrain){
      const { id, source } = gMapGlprops.terrainSource
      if(!map.getSource(id)){
        map.addSource(id, source);
        map.setTerrain(gMapGlprops.setTerrain);
      }
    }
    if(gMapGlprops.mapboxAddSourceValue){
      for(const mapboxAddSourceElement of gMapGlprops.mapboxAddSourceValue){
        const { id, source } = mapboxAddSourceElement;
        if(!map.getSource(id)){
          map.addSource(id, source);
        }
      }
    }
  },[gMapGlprops.mapboxAddLayerValue,gMapGlprops.terrain,gMapGlprops.mapboxAddSourceValue,map]);

  const onMapLoad = React.useCallback((evt:MapLoadEvent) => {
    setMap(evt.target);
    stateUpdate(evt.target);
    evt.target.on('styledata', function(){
      stateUpdate(evt.target);
    });
  },[]);

  React.useEffect(() => {
    if(map){
      if(props.terrain){
        const { id, source } = props.terrainSource
        if(!map.getSource(id)){
          map.addSource(id, source);
        }
        map.setTerrain(props.setTerrain);
      }else{
        map.setTerrain();
      }
    }
  },[props.terrain,props.mapStyle]);
  return (<InteractiveMap {...props as InteractiveMapProps} onLoad={onMapLoad} />);
};

const HarmoVisLayers = (props:Partial<Props>)=>{
  const [transition,setTransition] = React.useState<boolean>(false)
  const { actions, visible, viewport, mapStyle, mapboxApiAccessToken,
    layers, mapGlComponents, mapboxAddLayerValue, mapboxAddSourceValue,
    terrain, terrainSource, setTerrain, deckGLProps } = props;
  const onViewportChange = props.onViewportChange||actions.setViewport;
  const transitionDuration = transition?
    (viewport.transitionDuration||props.transitionDuration):0;
  const transitionInterruption = viewport.transitionInterruption||
    props.transitionInterruption;

  const initialize = React.useCallback((gl: WebGLRenderingContext)=>{
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  },[])

  React.useEffect(()=>{
    if (!transition) {
      setTransition(true);
    }
  })

  React.useEffect(()=>{
    const {transitionDuration} = viewport;
    if(transitionDuration !== 0){
      actions.setViewport({ transitionDuration:0 });
    }
  },[viewport.transitionDuration])

  if(visible){
    return (
      <MapGl
        {...viewport}
        mapStyle={mapStyle}
        onViewportChange={onViewportChange}
        mapboxApiAccessToken={mapboxApiAccessToken}
        visible={visible}
        transitionDuration={transitionDuration}
        transitionInterruption={transitionInterruption}
        mapboxAddLayerValue={mapboxAddLayerValue}
        mapboxAddSourceValue={mapboxAddSourceValue}
        terrain={terrain}
        terrainSource={terrainSource}
        setTerrain={setTerrain}
      >
        { mapGlComponents }
        <DeckGL {...deckGLProps} viewState={viewport} layers={layers} onWebGLInitialized={initialize} />
      </MapGl>
    );
  }else{
    return (
      <InteractiveMap
        {...viewport}
        onViewportChange={onViewportChange}
        mapboxApiAccessToken={mapboxApiAccessToken}
        visible={visible}
        transitionDuration={transitionDuration}
        transitionInterruption={transitionInterruption}
      >
        { mapGlComponents }
        <DeckGL {...deckGLProps} viewState={viewport} layers={layers} onWebGLInitialized={initialize} />
      </InteractiveMap>
    );
  }
}
HarmoVisLayers.defaultProps = {
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
  },{
    "id": 'sky',
    "type": 'sky',
    "paint": {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': [180.0, 60.0],
      'sky-atmosphere-sun-intensity': 5
    }
  }],
  terrain: false,
  terrainSource: {id:'mapbox-dem',source:{
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
  }},
  setTerrain: {source:'mapbox-dem'},
  transitionDuration: 0,
  deckGLProps:{}
}
export default HarmoVisLayers
