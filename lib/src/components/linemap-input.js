import * as React from 'react';
export default class LinemapInput extends React.Component {
    onSelect(e) {
        const { actions } = this.props;
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
    }
    onClick(e) {
        const { actions } = this.props;
        actions.setInputFilename({ linemapFileName: null });
        actions.setLinemapData([]);
        e.target.value = '';
    }
    render() {
        const { id, className, style } = this.props;
        return (React.createElement("input", { type: "file", accept: ".json", id: id, className: className, style: style, onClick: this.onClick.bind(this), onChange: this.onSelect.bind(this) }));
    }
}
LinemapInput.defaultProps = {
    i18n: {
        formatError: 'データ形式不正'
    }
};
//# sourceMappingURL=linemap-input.js.map