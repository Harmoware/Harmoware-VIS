import * as React from 'react';
export default class SpeedRange extends React.Component {
    setSecPerHour(e) {
        const value = +e.target.value;
        const { maxsecperhour, min, actions } = this.props;
        const secperhour = (maxsecperhour + min) - (value | 0);
        actions.setSecPerHour(secperhour);
    }
    render() {
        const { secperhour, maxsecperhour, min, step, id, className, title: propTitle } = this.props;
        const title = propTitle || `${secperhour}`;
        return (React.createElement("input", { type: "range", value: (maxsecperhour + min) - secperhour, min: min, max: maxsecperhour, step: step, onChange: this.setSecPerHour.bind(this), id: id, className: className, title: title }));
    }
}
SpeedRange.defaultProps = {
    maxsecperhour: 3600,
    min: 1,
    step: 1,
    className: 'harmovis_input_range'
};
//# sourceMappingURL=speed-range.js.map