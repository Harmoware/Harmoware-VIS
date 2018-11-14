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
var MovesInput = /** @class */ (function (_super) {
    __extends(MovesInput, _super);
    function MovesInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MovesInput.prototype.onSelect = function (e) {
        var _a = this.props, i18n = _a.i18n, actions = _a.actions;
        var reader = new FileReader();
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        actions.setLoading(true);
        actions.setMovesBase([]);
        reader.readAsText(file);
        var file_name = file.name;
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
            if (!Array.isArray(readdata)) { // Not Array?
                var movesbase = readdata.movesbase;
                if (!movesbase) {
                    actions.setLoading(false);
                    window.alert(i18n.formatError);
                    return;
                }
            }
            actions.setInputFilename({ movesFileName: file_name });
            actions.setMovesBase(readdata);
            actions.setRoutePaths([]);
            actions.setClicked(null);
            actions.setAnimatePause(false);
            actions.setAnimateReverse(false);
            actions.setLoading(false);
        };
    };
    MovesInput.prototype.render = function () {
        var _a = this.props, id = _a.id, className = _a.className, style = _a.style;
        return (React.createElement("input", { type: "file", accept: ".json", onChange: this.onSelect.bind(this), id: id, className: className, style: style }));
    };
    MovesInput.defaultProps = {
        i18n: {
            formatError: 'ラインマップデータ形式不正'
        }
    };
    return MovesInput;
}(React.Component));
export default MovesInput;
//# sourceMappingURL=moves-input.js.map