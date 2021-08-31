import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_navigation as icNavigation } from 'react-icons-kit/md';
const { max, min } = Math;
export default class NavigationButton extends React.Component {
    setViewport(argument) {
        this.props.actions.setViewport(argument);
    }
    setDefaultViewport() {
        this.props.actions.setDefaultViewport();
    }
    render() {
        const { buttonType, viewport, className, title: propTitle } = this.props;
        switch (buttonType) {
            case 'zoom-in': {
                const title = propTitle || buttonType;
                const zoom = min(viewport.zoom + 0.5, viewport.maxZoom);
                return (React.createElement("button", { onClick: this.setViewport.bind(this, { zoom }), className: className, title: title }, "\uFF0B"));
            }
            case 'zoom-out': {
                const title = propTitle || buttonType;
                const zoom = max(viewport.zoom - 0.5, viewport.minZoom);
                return (React.createElement("button", { onClick: this.setViewport.bind(this, { zoom }), className: className, title: title }, "\uFF0D"));
            }
            case 'compass': {
                const title = propTitle || 'Viewpoint reset';
                const iconStyle = { transform: `rotate(${-viewport.bearing}deg)` };
                return (React.createElement("button", { onClick: this.setDefaultViewport.bind(this), className: className, title: title },
                    React.createElement("div", { style: iconStyle },
                        React.createElement(Icon, { icon: icNavigation }))));
            }
            default:
                return null;
        }
    }
}
NavigationButton.defaultProps = {
    className: 'harmovis_button'
};
//# sourceMappingURL=navigation-button.js.map