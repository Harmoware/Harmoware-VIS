import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_replay as icReplay } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
export default class ReverseButton extends React.Component {
    setAnimateReverse() {
        this.props.actions.setAnimateReverse(true);
    }
    render() {
        const { children, i18n, className, title: propTitle } = this.props;
        const title = propTitle || (children && children.toString()) || i18n.reverseButtonCaption;
        return (React.createElement("button", { onClick: this.setAnimateReverse.bind(this), className: className, title: title }, children === undefined ?
            React.createElement("span", { style: default_style },
                React.createElement(Icon, { icon: icReplay }),
                "\u00A0",
                i18n.reverseButtonCaption) :
            React.createElement("span", null, children)));
    }
}
ReverseButton.defaultProps = {
    i18n: {
        reverseButtonCaption: 'REVERSE'
    },
    className: 'harmovis_button'
};
//# sourceMappingURL=reverse-button.js.map