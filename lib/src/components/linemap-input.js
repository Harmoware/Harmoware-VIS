var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
var LinemapInput = /** @class */ (function (_super) {
    __extends(LinemapInput, _super);
    function LinemapInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinemapInput.prototype.onSelect = function (e) {
        var actions = this.props.actions;
        var reader = new FileReader();
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        actions.setLoading(true);
        actions.setLinemapData([]);
        reader.readAsText(file);
        var file_name = file.name;
        reader.onload = function () {
            var readdata = [];
            try {
                readdata = JSON.parse(reader.result.toString());
            }
            catch (exception) {
                actions.setLoading(false);
                window.alert(exception);
                return;
            }
            if (readdata.length > 0) {
                actions.setInputFilename({ linemapFileName: file_name });
                actions.setLoading(false);
                actions.setLinemapData(readdata);
                return;
            }
            actions.setInputFilename({ linemapFileName: null });
            actions.setLinemapData([]);
            actions.setLoading(false);
        };
    };
    LinemapInput.prototype.onClick = function (e) {
        var actions = this.props.actions;
        actions.setInputFilename({ linemapFileName: null });
        actions.setLinemapData([]);
        e.target.value = '';
    };
    LinemapInput.prototype.render = function () {
        var _a = this.props, id = _a.id, className = _a.className, style = _a.style;
        return (React.createElement("input", { type: "file", accept: ".json", id: id, className: className, style: style, onClick: this.onClick.bind(this), onChange: this.onSelect.bind(this) }));
    };
    LinemapInput.defaultProps = {
        i18n: {
            formatError: 'データ形式不正'
        }
    };
    return LinemapInput;
}(React.Component));
export default LinemapInput;
//# sourceMappingURL=linemap-input.js.map