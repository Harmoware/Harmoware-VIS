import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
export default class PlayButton extends React.Component {
    setAnimatePause() {
        this.props.actions.setAnimatePause(false);
    }
    render() {
        const { children, i18n, className, title: propTitle } = this.props;
        const title = propTitle || (children && children.toString()) || i18n.playButtonCaption;
        return (React.createElement("button", { onClick: this.setAnimatePause.bind(this), className: className, title: title }, children === undefined ?
            React.createElement("span", { style: default_style },
                React.createElement(Icon, { icon: icPlayArrow }),
                "\u00A0",
                i18n.playButtonCaption) :
            React.createElement("span", null, children)));
    }
}
PlayButton.defaultProps = {
    i18n: {
        playButtonCaption: '️PLAY'
    },
    className: 'harmovis_button'
};
//# sourceMappingURL=play-button.js.map