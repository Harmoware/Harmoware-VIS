var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { GridCellLayer } from 'deck.gl';
var DEFAULT_COLOR = [255, 255, 255, 255];
var CubeiconLayer = /** @class */ (function (_super) {
    __extends(CubeiconLayer, _super);
    function CubeiconLayer(props) {
        return _super.call(this, Object.assign({}, props, { getElevation: props.getHeight, offset: [0, 0] })) || this;
    }
    CubeiconLayer.defaultProps = {
        getHeight: function (x) { return x.height; },
        getFillColor: function (x) { return x.color || DEFAULT_COLOR; },
        getLineColor: function (x) { return x.color || DEFAULT_COLOR; },
        getColor: { deprecatedFor: ['getFillColor', 'getLineColor'] }
    };
    CubeiconLayer.layerName = 'CubeiconLayer';
    return CubeiconLayer;
}(GridCellLayer));
export default CubeiconLayer;
//# sourceMappingURL=index.js.map