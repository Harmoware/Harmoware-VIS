import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const PauseButton = (props) => {
    const { children, i18n, className, title: propTitle } = props;
    const title = propTitle || (children && children.toString()) || i18n.pauseButtonCaption;
    const setAnimatePause = () => {
        props.actions.setAnimatePause(true);
    };
    return (React.createElement("button", { onClick: setAnimatePause, className: className, title: title }, children === undefined ?
        React.createElement("span", { style: default_style },
            React.createElement(Icon, { icon: icPause }),
            "\u00A0",
            i18n.pauseButtonCaption) :
        React.createElement("span", null, children)));
};
PauseButton.defaultProps = {
    i18n: {
        pauseButtonCaption: 'PAUSE'
    },
    className: 'harmovis_button'
};
export default PauseButton;
//# sourceMappingURL=pause-button.js.map