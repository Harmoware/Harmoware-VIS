import * as React from 'react';
const { isArray } = Array;
const MovesInput = (props) => {
    const { actions, id, className, style, i18n } = props;
    const onClick = React.useCallback((e) => {
        actions.setInputFilename({ movesFileName: null });
        actions.setMovesBase([]);
        e.target.value = '';
    }, []);
    const onSelect = React.useCallback((e) => {
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
    }, [i18n]);
    return (React.createElement("input", { type: "file", accept: ".json", id: id, className: className, style: style, onClick: onClick, onChange: onSelect }));
};
MovesInput.defaultProps = {
    i18n: {
        formatError: 'データ形式不正'
    }
};
export default MovesInput;
//# sourceMappingURL=moves-input.js.map