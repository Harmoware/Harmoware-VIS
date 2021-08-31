import * as React from 'react';
const { max, min } = Math;
export default class SpeedValue extends React.Component {
    setSecPerHour(e) {
        const value = +e.target.value;
        const { actions, maxsecperhour, min: minimum } = this.props;
        const secperhour = min(maxsecperhour, max(minimum, value));
        actions.setSecPerHour(secperhour);
    }
    render() {
        const { secperhour, maxsecperhour, min, id, className } = this.props;
        return (React.createElement("input", { type: "number", value: secperhour, min: min, max: maxsecperhour, onChange: this.setSecPerHour.bind(this), id: id, className: className }));
    }
}
SpeedValue.defaultProps = {
    maxsecperhour: 3600,
    min: 1,
    className: 'harmovis_input_number'
};
//# sourceMappingURL=speed-value.js.map