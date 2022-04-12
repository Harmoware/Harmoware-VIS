import * as React from 'react';
import { RingLoader } from 'react-spinners';
const LoadingIcon = (props) => {
    const { loading, color } = props;
    if (loading) {
        const devStyle = { position: 'fixed', zIndex: 200, top: 0, left: 0, width: '100%', height: '100%', display: 'flex' };
        const iconStyle = { margin: 'auto', display: 'flex' };
        return (React.createElement("div", { style: devStyle },
            React.createElement("div", { style: iconStyle },
                React.createElement(RingLoader, { size: 60, color: color, loading: loading }))));
    }
    return null;
};
LoadingIcon.defaultProps = {
    loading: false,
    color: 'white'
};
export default LoadingIcon;
//# sourceMappingURL=loading-icon.js.map