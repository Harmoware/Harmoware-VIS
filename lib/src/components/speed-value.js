import * as React from 'react';
const { max, min } = Math;
export default class SpeedValue extends React.Component {
    setSecPerHour(e) {
        const value = +e.target.value;
        const { actions, maxsecperhour, min: minimum } = this.props;
        const secperhour = min(maxsecperhour, max(minimum, value));
        actions.setSecPerHour(secperhour);
    }
    setMultiplySpeed(e) {
        const value = +e.target.value;
        const { actions, maxmultiplySpeed, min: minimum } = this.props;
        const multiplySpeed = min(maxmultiplySpeed, max(minimum, value));
        actions.setMultiplySpeed(multiplySpeed);
    }
    render() {
        const { secperhour, multiplySpeed, maxsecperhour, maxmultiplySpeed, min, id, className } = this.props;
        return (secperhour ?
            React.createElement("input", { type: "number", value: secperhour, min: min, max: maxsecperhour, onChange: this.setSecPerHour.bind(this), id: id, className: className })
            : multiplySpeed ?
                React.createElement("input", { type: "number", value: multiplySpeed, min: min, max: maxmultiplySpeed, onChange: this.setMultiplySpeed.bind(this), id: id, className: className })
                : React.createElement("p", null, "SpeedValue props error!"));
    }
}
SpeedValue.defaultProps = {
    maxsecperhour: 3600,
    maxmultiplySpeed: 3600,
    min: 1,
    className: 'harmovis_input_number'
};
//# sourceMappingURL=speed-value.js.map