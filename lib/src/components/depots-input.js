import * as React from 'react';
const DepotsInput = (props) => {
    const { actions, id, className, style, i18n } = props;
    const onClick = (e) => {
        actions.setInputFilename({ depotsFileName: null });
        actions.setDepotsBase([]);
        e.target.value = '';
    };
    const onSelect = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        actions.setLoading(true);
        actions.setDepotsBase([]);
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
                const { longitude, latitude, position } = readdata[0];
                if ((longitude && latitude) || position) {
                    actions.setInputFilename({ depotsFileName: file_name });
                    actions.setLoading(false);
                    actions.setDepotsBase(readdata);
                    return;
                }
                window.alert(i18n.formatError);
            }
            actions.setInputFilename({ depotsFileName: null });
            actions.setDepotsBase([]);
            actions.setLoading(false);
        };
    };
    return (React.createElement("input", { type: "file", accept: ".json", id: id, className: className, style: style, onClick: onClick, onChange: onSelect }));
};
DepotsInput.defaultProps = {
    i18n: {
        formatError: 'データ形式不正'
    }
};
export default DepotsInput;
//# sourceMappingURL=depots-input.js.map