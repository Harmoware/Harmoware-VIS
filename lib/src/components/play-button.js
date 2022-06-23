import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const PlayButton = (props) => {
    const { children, i18n, className, title: propTitle } = props;
    const title = React.useMemo(() => propTitle || (children && children.toString()) || i18n.playButtonCaption, [children, i18n.playButtonCaption]);
    const setAnimatePause = () => {
        props.actions.setAnimatePause(false);
    };
    const Result = React.useMemo(() => React.createElement("button", { onClick: setAnimatePause, className: className, title: title }, children === undefined ?
        React.createElement("span", { style: default_style },
            React.createElement(Icon, { icon: icPlayArrow }),
            ` ${i18n.playButtonCaption}`) :
        React.createElement("span", null, children)), [title, children, i18n.playButtonCaption]);
    return Result;
};
PlayButton.defaultProps = {
    i18n: {
        playButtonCaption: '️PLAY'
    },
    className: 'harmovis_button'
};
export default PlayButton;
//# sourceMappingURL=play-button.js.map