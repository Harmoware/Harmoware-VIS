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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { GridCellLayer } from 'deck.gl';
import { PhongMaterial } from '@luma.gl/core';
var DEFAULT_COLOR = [255, 255, 255, 255];
var CubeiconLayer = /** @class */ (function (_super) {
    __extends(CubeiconLayer, _super);
    function CubeiconLayer(props) {
        var _this = this;
        var getColor = props.getColor, getFillColor = props.getFillColor, getLineColor = props.getLineColor, otherProps = __rest(props, ["getColor", "getFillColor", "getLineColor"]);
        _this = _super.call(this, Object.assign({}, otherProps, {
            getFillColor: getFillColor || getColor,
            getLineColor: getLineColor || getColor,
            getElevation: props.getHeight,
            offset: [0, 0]
        })) || this;
        return _this;
    }
    CubeiconLayer.defaultProps = {
        getHeight: function (x) { return x.height; },
        getColor: function (x) { return x.color || DEFAULT_COLOR; },
        material: new PhongMaterial({
            ambient: 0.4,
            diffuse: 0.6,
            shininess: 32,
            specularColor: [30, 30, 30]
        })
    };
    CubeiconLayer.layerName = 'CubeiconLayer';
    return CubeiconLayer;
}(GridCellLayer));
export default CubeiconLayer;
//# sourceMappingURL=index.js.map