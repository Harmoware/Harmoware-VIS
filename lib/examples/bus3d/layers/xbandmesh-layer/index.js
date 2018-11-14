var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { GridCellLayer, CompositeLayer } from 'deck.gl';
var XbandmeshLayer = /** @class */ (function (_super) {
    __extends(XbandmeshLayer, _super);
    // props:Props;
    function XbandmeshLayer(props) {
        return _super.call(this, props) || this;
    }
    XbandmeshLayer.prototype.renderLayers = function () {
        var _a = this.props, rainfall = _a.rainfall, layerOpacity = _a.layerOpacity, layerCellSize = _a.layerCellSize, layerElevationScale = _a.layerElevationScale, lightSettings = _a.lightSettings, getElevation = _a.getElevation, getColor = _a.getColor, getRainfallColor = _a.getRainfallColor, defaultColor = _a.defaultColor;
        if (!lightSettings) {
            alert('XbandmeshLayer: props 指定エラー');
            return null;
        }
        if (!rainfall || rainfall.length === 0) {
            return null;
        }
        var getCellColor = function (x) { return getColor(x) || getRainfallColor(getElevation(x)) || defaultColor; };
        return [
            new GridCellLayer({
                id: 'xband-mesh-layer',
                data: rainfall,
                getElevation: getElevation,
                getColor: getCellColor,
                opacity: layerOpacity,
                cellSize: layerCellSize,
                elevationScale: layerElevationScale,
                lightSettings: lightSettings,
                pickable: true
            })
        ];
    };
    XbandmeshLayer.defaultProps = {
        layerOpacity: 0.2,
        layerCellSize: 100,
        layerElevationScale: 20,
        getElevation: function (x) { return x.elevation || 0; },
        getColor: function (x) { return x.color; },
        getRainfallColor: function (x) {
            if (x < 3) { // 0:白 => 3:水色
                return [255.0 - ((x / 3.0) * 255.0), 255.0, 255.0];
            }
            else if (x < 12) { // 3:水色 => 12:青
                return [0.0, 255.0 - (((x - 3.0) / 9.0) * 255.0), 255.0];
            }
            else if (x < 25) { // 12:青 => 25:黄
                return [(((x - 12.0) / 13.0) * 255.0), (((x - 12.0) / 13.0) * 255.0),
                    255.0 - (((x - 12.0) / 13.0) * 255.0)];
            }
            else if (x < 40) { // 25:黄 => 40:赤
                return [255.0, 255.0 - (((x - 25.0) / 15.0) * 255.0), 0.0];
            }
            else if (x < 80) { // 40:赤 => 80:紫
                return [255.0 - (((x - 40.0) / 40.0) * 127.0), 0.0, (((x - 40.0) / 40.0) * 255.0)];
            }
            return [127.0, 0.0, 255.0]; // 80～:紫
        },
        defaultColor: [0, 255, 255]
    };
    XbandmeshLayer.layerName = 'XbandmeshLayer';
    return XbandmeshLayer;
}(CompositeLayer));
export default XbandmeshLayer;
//# sourceMappingURL=index.js.map