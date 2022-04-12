import * as React from 'react';
import InteractiveMap from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
let gMapGlprops;
const MapGl = (props) => {
    gMapGlprops = props;
    const [map, setMap] = React.useState(undefined);
    const stateUpdate = React.useCallback((map) => {
        if (gMapGlprops.mapboxAddLayerValue) {
            for (const LayerValuemapElement of gMapGlprops.mapboxAddLayerValue) {
                if (!map.getLayer(LayerValuemapElement.id)) {
                    map.addLayer(LayerValuemapElement);
                }
            }
        }
        if (gMapGlprops.terrain) {
            const { id, source } = gMapGlprops.terrainSource;
            if (!map.getSource(id)) {
                map.addSource(id, source);
                map.setTerrain(gMapGlprops.setTerrain);
            }
        }
        if (gMapGlprops.mapboxAddSourceValue) {
            for (const mapboxAddSourceElement of gMapGlprops.mapboxAddSourceValue) {
                const { id, source } = mapboxAddSourceElement;
                if (!map.getSource(id)) {
                    map.addSource(id, source);
                }
            }
        }
    }, [map]);
    const onMapLoad = React.useCallback(evt => {
        setMap(evt.target);
        stateUpdate(evt.target);
        evt.target.on('styledata', function () {
            stateUpdate(evt.target);
        });
    }, []);
    React.useEffect(() => {
        if (map) {
            if (props.terrain) {
                const { id, source } = props.terrainSource;
                if (!map.getSource(id)) {
                    map.addSource(id, source);
                }
                map.setTerrain(props.setTerrain);
            }
            else {
                map.setTerrain();
            }
        }
    }, [props.terrain, props.mapStyle]);
    return (React.createElement(InteractiveMap, Object.assign({}, props, { onLoad: onMapLoad })));
};
const HarmoVisLayers = (props) => {
    const [transition, setTransition] = React.useState(false);
    const { actions, visible, viewport, mapStyle, mapboxApiAccessToken, layers, mapGlComponents, mapboxAddLayerValue, mapboxAddSourceValue, terrain, terrainSource, setTerrain } = props;
    const onViewportChange = props.onViewportChange || actions.setViewport;
    const transitionDuration = transition ?
        (viewport.transitionDuration || props.transitionDuration) : 0;
    const transitionInterpolator = viewport.transitionInterpolator ||
        props.transitionInterpolator;
    const transitionInterruption = viewport.transitionInterruption ||
        props.transitionInterruption;
    const initialize = (gl) => {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };
    React.useEffect(() => {
        if (!transition) {
            setTransition(true);
        }
    });
    React.useEffect(() => {
        const { transitionDuration } = viewport;
        if (transitionDuration !== 0) {
            actions.setViewport({
                transitionDuration: 0,
                transitionInterpolator: undefined
            });
        }
    }, [viewport.transitionDuration]);
    if (visible) {
        return (React.createElement(MapGl, Object.assign({}, viewport, { mapStyle: mapStyle, onViewportChange: onViewportChange, mapboxApiAccessToken: mapboxApiAccessToken, visible: visible, transitionDuration: transitionDuration, transitionInterpolator: transitionInterpolator, transitionInterruption: transitionInterruption, mapboxAddLayerValue: mapboxAddLayerValue, mapboxAddSourceValue: mapboxAddSourceValue, terrain: terrain, terrainSource: terrainSource, setTerrain: setTerrain }),
            mapGlComponents,
            React.createElement(DeckGL, { viewState: viewport, layers: layers, onWebGLInitialized: initialize })));
    }
    else {
        const viewState = Object.assign(Object.assign({}, viewport), { transitionDuration, transitionInterpolator, transitionInterruption });
        return (React.createElement(DeckGL, { controller: { type: MapController }, onViewStateChange: (v) => onViewportChange(v.viewState), viewState: viewState, layers: layers, onWebGLInitialized: initialize }));
    }
};
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
                    5, 0, 5.05, ["get", "height"]
                ],
                "fill-extrusion-base": [
                    "interpolate", ["linear"], ["zoom"],
                    5, 0, 5.05, ["get", "min_height"]
                ],
                "fill-extrusion-opacity": .6
            },
        }, {
            "id": 'sky',
            "type": 'sky',
            "paint": {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [180.0, 60.0],
                'sky-atmosphere-sun-intensity': 5
            }
        }],
    terrain: false,
    terrainSource: { id: 'mapbox-dem', source: {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        } },
    setTerrain: { source: 'mapbox-dem' },
    transitionDuration: 0,
};
export default HarmoVisLayers;
//# sourceMappingURL=harmovislayers.js.map