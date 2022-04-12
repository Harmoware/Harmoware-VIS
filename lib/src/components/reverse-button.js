import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_replay as icReplay } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const ReverseButton = (props) => {
    const { children, i18n, className, title: propTitle } = props;
    const title = propTitle || (children && children.toString()) || i18n.reverseButtonCaption;
    const setAnimateReverse = () => {
        props.actions.setAnimateReverse(true);
    };
    return (React.createElement("button", { onClick: setAnimateReverse, className: className, title: title }, children === undefined ?
        React.createElement("span", { style: default_style },
            React.createElement(Icon, { icon: icReplay }),
            "\u00A0",
            i18n.reverseButtonCaption) :
        React.createElement("span", null, children)));
};
ReverseButton.defaultProps = {
    i18n: {
        reverseButtonCaption: 'REVERSE'
    },
    className: 'harmovis_button'
};
export default ReverseButton;
//# sourceMappingURL=reverse-button.js.map