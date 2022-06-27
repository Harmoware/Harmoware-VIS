import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_forward as icForward } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const ForwardButton = (props) => {
    const { children, i18n, className, title: propTitle } = props;
    const defaultCaption = React.useMemo(() => React.createElement("span", { style: default_style },
        React.createElement(Icon, { icon: icForward }),
        ` ${i18n.forwardButtonCaption}`), [i18n.forwardButtonCaption]);
    const setAnimateReverse = () => {
        props.actions.setAnimateReverse(false);
    };
    const Result = React.useMemo(() => React.createElement("button", { onClick: setAnimateReverse, className: className, title: propTitle || (children && children.toString()) || i18n.forwardButtonCaption }, children === undefined ? React.createElement(React.Fragment, null, defaultCaption) : React.createElement("span", null, children)), [props]);
    return Result;
};
ForwardButton.defaultProps = {
    i18n: {
        forwardButtonCaption: 'FORWARD'
    },
    className: 'harmovis_button'
};
export default ForwardButton;
//# sourceMappingURL=forward-button.js.map