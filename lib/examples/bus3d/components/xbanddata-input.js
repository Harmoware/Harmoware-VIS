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
import * as React from 'react';
var XbandDataInput = /** @class */ (function (_super) {
    __extends(XbandDataInput, _super);
    function XbandDataInput(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            filename: '',
        };
        return _this;
    }
    XbandDataInput.prototype.onSelect = function (e) {
        var _this = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var actions = this.props.actions;
        actions.setLoading(true);
        reader.readAsText(file);
        reader.onload = function () {
            var readdata = null;
            try {
                readdata = JSON.parse(reader.result.toString());
            }
            catch (exception) {
                actions.setLoading(false);
                window.alert(exception);
                return;
            }
            if (readdata.length > 0) {
                var _a = readdata[0], position = _a.position, elevation = _a.elevation, color = _a.color;
                if (position && (elevation || color)) {
                    actions.setRainfall(readdata);
                    _this.setState({ filename: file.name });
                    actions.setLoading(false);
                    return;
                }
                actions.setLoading(false);
                window.alert('雨量データ形式不正');
            }
            actions.setRainfall([]);
            _this.setState({ filename: '選択されていません' });
            actions.setLoading(false);
        };
    };
    XbandDataInput.prototype.render = function () {
        var t = this.props.t;
        var nowrapstyle = { textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
        return (React.createElement("div", { className: "input-group input-group-sm" },
            React.createElement("label", { htmlFor: "XbandDataInput", className: "harmovis_button" },
                t('XbandDataInput'),
                React.createElement("input", { type: "file", accept: ".json", onChange: this.onSelect.bind(this), id: "XbandDataInput", style: { display: 'none' } })),
            React.createElement("div", { style: nowrapstyle }, this.state.filename)));
    };
    return XbandDataInput;
}(React.Component));
export default XbandDataInput;
//# sourceMappingURL=xbanddata-input.js.map