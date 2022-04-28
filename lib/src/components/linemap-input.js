import * as React from 'react';
const LinemapInput = (props) => {
    const { actions, id, className, style } = props;
    const onClick = React.useCallback((e) => {
        actions.setInputFilename({ linemapFileName: null });
        actions.setLinemapData([]);
        e.target.value = '';
    }, []);
    const onSelect = React.useCallback((e) => {
        const reader = new FileReader();
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        actions.setLoading(true);
        actions.setLinemapData([]);
        reader.readAsText(file);
        const file_name = file.name;
        reader.onload = () => {
            let readdata = [];
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
    }, []);
    return (React.createElement("input", { type: "file", accept: ".json", id: id, className: className, style: style, onClick: onClick, onChange: onSelect }));
};
LinemapInput.defaultProps = {
    i18n: {
        formatError: 'データ形式不正'
    }
};
export default LinemapInput;
//# sourceMappingURL=linemap-input.js.map