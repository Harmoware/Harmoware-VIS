import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_navigation as icNavigation } from 'react-icons-kit/md';
const { max, min } = Math;
const NavigationButton = (props) => {
    const { buttonType, viewport, className, title: propTitle } = props;
    const setViewport = (argument) => {
        props.actions.setViewport(argument);
    };
    const setDefaultViewport = () => {
        props.actions.setDefaultViewport();
    };
    switch (buttonType) {
        case 'zoom-in': {
            const title = propTitle || buttonType;
            const zoom = min(viewport.zoom + 0.5, viewport.maxZoom);
            return (React.createElement("button", { onClick: () => setViewport({ zoom }), className: className, title: title }, "\uFF0B"));
        }
        case 'zoom-out': {
            const title = propTitle || buttonType;
            const zoom = max(viewport.zoom - 0.5, viewport.minZoom);
            return (React.createElement("button", { onClick: () => setViewport({ zoom }), className: className, title: title }, "\uFF0D"));
        }
        case 'compass': {
            const title = propTitle || 'Viewpoint reset';
            const iconStyle = { transform: `rotate(${-viewport.bearing}deg)` };
            return (React.createElement("button", { onClick: setDefaultViewport, className: className, title: title },
                React.createElement("div", { style: iconStyle },
                    React.createElement(Icon, { icon: icNavigation }))));
        }
        default:
            return null;
    }
};
NavigationButton.defaultProps = {
    className: 'harmovis_button'
};
export default NavigationButton;
//# sourceMappingURL=navigation-button.js.map