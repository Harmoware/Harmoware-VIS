import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const PauseButton = (props) => {
    const { children, i18n, className, title: propTitle } = props;
    const title = React.useMemo(() => propTitle || (children && children.toString()) || i18n.pauseButtonCaption, [children, i18n.pauseButtonCaption]);
    const setAnimatePause = () => {
        props.actions.setAnimatePause(true);
    };
    const Result = React.useMemo(() => React.createElement("button", { onClick: setAnimatePause, className: className, title: title }, children === undefined ?
        React.createElement("span", { style: default_style },
            React.createElement(Icon, { icon: icPause }),
            ` ${i18n.pauseButtonCaption}`) :
        React.createElement("span", null, children)), [title, children, i18n.pauseButtonCaption]);
    return Result;
};
PauseButton.defaultProps = {
    i18n: {
        pauseButtonCaption: 'PAUSE'
    },
    className: 'harmovis_button'
};
export default PauseButton;
//# sourceMappingURL=pause-button.js.map