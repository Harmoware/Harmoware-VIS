import { GridCellLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
const { abs } = Math;
const DEFAULT_COLOR = [255, 255, 255, 255];
const pm = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
// position:[longitude,latitude,[elevation]]
const getPosition = (x) => x.position;
class CubeGraphLayer extends CompositeLayer {
    constructor(props) {
        super(props);
    }
    ;
    renderLayers() {
        const { id, optionData, visible, pickable, opacity, cellSize, elevationScale, getCubeElevation, getCubeColor, getRadius, stacking1, stacking2, optionCentering } = this.props;
        if (!optionData || optionData.length === 0 || !visible) {
            return null;
        }
        const { distanceScales: { degreesPerUnit, unitsPerMeter } } = this.context.viewport;
        const degreesMeterLng = abs(degreesPerUnit[0]) * abs(unitsPerMeter[0]);
        const degreesMeterLat = abs(degreesPerUnit[1]) * abs(unitsPerMeter[1]);
        const halfcellSize = cellSize >> 1;
        const setdata = [];
        const selectOptionData = optionData.filter(x => x.position && getCubeElevation(x));
        for (const item of selectOptionData) {
            const position = item.position;
            let height = position[2] || 0;
            const elevation = getCubeElevation(item);
            const color = getCubeColor(item) || [DEFAULT_COLOR];
            const radius = (optionCentering ? 0 : getRadius(item) || cellSize) + halfcellSize;
            const shiftLng = degreesMeterLng * radius;
            const shiftLat = degreesMeterLat * radius;
            for (let j = 0; j < elevation.length; j = (j + 1) | 0) {
                if (elevation[j] === 0)
                    continue;
                const elevationValue = elevation[j] * elevationScale;
                const setcolor = color[j] || DEFAULT_COLOR;
                const setposition = [0, 0, 0];
                if (stacking1) {
                    setposition[0] = position[0];
                    setposition[1] = position[1];
                    setposition[2] = height;
                    height = height + elevationValue;
                }
                else if (stacking2) {
                    if (j === 2)
                        height = position[2] || 0;
                    setposition[0] = position[0] + (pm[j][0] * shiftLng);
                    setposition[1] = position[1];
                    setposition[2] = height;
                    height = height + elevationValue;
                }
                else {
                    setposition[0] = position[0] + (pm[j][0] * shiftLng);
                    setposition[1] = position[1] + (pm[j][1] * shiftLat);
                    setposition[2] = height;
                }
                setdata.push({
                    position: setposition,
                    elevation: elevation[j],
                    color: setcolor,
                });
            }
        }
        return setdata.length > 0 ? new GridCellLayer({
            id: id + '-GridCellLayer',
            data: setdata,
            pickable,
            opacity,
            cellSize,
            elevationScale,
            getPosition: (x) => x.position || null,
            getElevation: (x) => x.elevation,
            getFillColor: (x) => x.color,
            offset: [0, 0],
        }) : null;
    }
}
CubeGraphLayer.defaultProps = {
    id: 'CubeGraphLayer',
    visible: true,
    cellSize: 12,
    coverage: 1,
    elevationScale: 1,
    opacity: 0.25,
    extruded: true,
    getRadius: (x) => x.radius,
    stacking1: false,
    stacking2: false,
    optionCentering: false,
};
CubeGraphLayer.layerName = 'CubeGraphLayer';
export default CubeGraphLayer;
//# sourceMappingURL=index.js.map