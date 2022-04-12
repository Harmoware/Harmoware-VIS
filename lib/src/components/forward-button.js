import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_forward as icForward } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const ForwardButton = (props) => {
    const { children, i18n, className, title: propTitle } = props;
    const title = propTitle || (children && children.toString()) || i18n.forwardButtonCaption;
    const setAnimateReverse = () => {
        props.actions.setAnimateReverse(false);
    };
    return (React.createElement("button", { onClick: setAnimateReverse, className: className, title: title }, children === undefined ?
        React.createElement("span", { style: default_style },
            React.createElement(Icon, { icon: icForward }),
            "\u00A0",
            i18n.forwardButtonCaption) :
        React.createElement("span", null, children)));
};
ForwardButton.defaultProps = {
    i18n: {
        forwardButtonCaption: 'FORWARD'
    },
    className: 'harmovis_button'
};
export default ForwardButton;
//# sourceMappingURL=forward-button.js.map