import * as React from 'react';
const { isArray } = Array;
export default class MovesInput extends React.Component {
    onSelect(e) {
        const { i18n, actions } = this.props;
        const reader = new FileReader();
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        actions.setLoading(true);
        actions.setMovesBase([]);
        reader.readAsText(file);
        const file_name = file.name;
        reader.onload = () => {
            let readdata = null;
            try {
                readdata = JSON.parse(reader.result.toString());
            }
            catch (exception) {
                actions.setLoading(false);
                window.alert(exception);
                return;
            }
            if (!isArray(readdata)) { // Not Array?
                const { movesbase } = readdata;
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
    }
    onClick(e) {
        const { actions } = this.props;
        actions.setInputFilename({ movesFileName: null });
        actions.setMovesBase([]);
        e.target.value = '';
    }
    render() {
        const { id, className, style } = this.props;
        return (React.createElement("input", { type: "file", accept: ".json", id: id, className: className, style: style, onClick: this.onClick.bind(this), onChange: this.onSelect.bind(this) }));
    }
}
MovesInput.defaultProps = {
    i18n: {
        formatError: 'データ形式不正'
    }
};
//# sourceMappingURL=moves-input.js.map