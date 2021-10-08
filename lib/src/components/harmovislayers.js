import * as React from 'react';
import InteractiveMap from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
const MapGl = (props) => {
    const [execflg, setFlg] = React.useState(false);
    const [prevStyle, setStyle] = React.useState(props.mapStyle);
    const [prevTerr, setTerr] = React.useState(props.terrain);
    const interactiveMapRef = React.useRef(null);
    const map = interactiveMapRef.current && interactiveMapRef.current.getMap();
    const addLayer = () => {
        if (props.mapboxAddLayerValue) {
            for (const LayerValuemapElement of props.mapboxAddLayerValue) {
                if (!map.getLayer(LayerValuemapElement.id)) {
                    map.addLayer(LayerValuemapElement);
                }
            }
        }
    };
    const setTerrain = () => {
        if (props.terrain) {
            const { id, source } = props.terrainSource;
            if (!map.getSource(id)) {
                map.addSource(id, source);
                map.setTerrain(props.setTerrain);
            }
        }
    };
    const setSource = () => {
        if (props.mapboxAddSourceValue) {
            for (const mapboxAddSourceElement of props.mapboxAddSourceValue) {
                const { id, source } = mapboxAddSourceElement;
                if (!map.getSource(id)) {
                    map.addSource(id, source);
                }
            }
        }
    };
    if (map) {
        if (!execflg) {
            setFlg(true);
            map.once('load', function () {
                addLayer();
                setTerrain();
                setSource();
                setFlg(false);
            });
            map.once('styledata', function () {
                addLayer();
                setTerrain();
                setSource();
                setFlg(false);
            });
        }
        if (prevTerr !== props.terrain || prevStyle !== props.mapStyle) {
            setTerr(props.terrain);
            setStyle(props.mapStyle);
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
            setFlg(false);
        }
    }
    return (React.createElement(InteractiveMap, Object.assign({}, props, { ref: interactiveMapRef })));
};
export default class HarmoVisLayers extends React.Component {
    constructor(props) {
        super(props);
        this.state = { transition: false };
    }
    componentDidUpdate(prevProps) {
        if (!this.state.transition) {
            this.setState({ transition: true });
        }
        const { transitionDuration } = this.props.viewport;
        if (transitionDuration !== prevProps.viewport.transitionDuration) {
            if (transitionDuration !== 0) {
                this.props.actions.setViewport({
                    transitionDuration: 0,
                    transitionInterpolator: undefined
                });
            }
        }
    }
    initialize(gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }
    render() {
        const { props } = this;
        const { actions, visible, viewport, mapStyle, mapboxApiAccessToken, layers, mapGlComponents, mapboxAddLayerValue, mapboxAddSourceValue, terrain, terrainSource, setTerrain } = props;
        const onViewportChange = props.onViewportChange || actions.setViewport;
        const transitionDuration = this.state.transition ?
            (viewport.transitionDuration || props.transitionDuration) : 0;
        const transitionInterpolator = viewport.transitionInterpolator ||
            props.transitionInterpolator;
        const transitionInterruption = viewport.transitionInterruption ||
            props.transitionInterruption;
        if (visible) {
            return (React.createElement(MapGl, Object.assign({}, viewport, { mapStyle: mapStyle, onViewportChange: onViewportChange, mapboxApiAccessToken: mapboxApiAccessToken, visible: visible, transitionDuration: transitionDuration, transitionInterpolator: transitionInterpolator, transitionInterruption: transitionInterruption, mapboxAddLayerValue: mapboxAddLayerValue, mapboxAddSourceValue: mapboxAddSourceValue, terrain: terrain, terrainSource: terrainSource, setTerrain: setTerrain }),
                mapGlComponents,
                React.createElement(DeckGL, { viewState: viewport, layers: layers, onWebGLInitialized: this.initialize })));
        }
        else {
            const viewState = Object.assign(Object.assign({}, viewport), { transitionDuration, transitionInterpolator, transitionInterruption });
            return (React.createElement(DeckGL, { controller: { type: MapController }, onViewStateChange: (v) => onViewportChange(v.viewState), viewState: viewState, layers: layers, onWebGLInitialized: this.initialize }));
        }
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
//# sourceMappingURL=harmovislayers.js.map