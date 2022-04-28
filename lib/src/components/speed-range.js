import * as React from 'react';
const SpeedRange = (props) => {
    const { actions, secperhour, multiplySpeed, maxsecperhour, maxmultiplySpeed, min: prop_min, step, id, className, title: propTitle } = props;
    const title = propTitle || `${secperhour}`;
    const setSecPerHour = React.useCallback((e) => {
        const value = +e.target.value;
        const secperhour = (maxsecperhour + prop_min) - (value | 0);
        actions.setSecPerHour(secperhour);
    }, [maxsecperhour, prop_min]);
    const setMultiplySpeed = React.useCallback((e) => {
        const value = +e.target.value;
        const multiplySpeed = value | 0;
        actions.setMultiplySpeed(multiplySpeed);
    }, []);
    return (secperhour ?
        React.createElement("input", { type: "range", value: (maxsecperhour + prop_min) - secperhour, min: prop_min, max: maxsecperhour, step: step, onChange: setSecPerHour, id: id, className: className, title: title })
        : multiplySpeed ?
            React.createElement("input", { type: "range", value: multiplySpeed, min: prop_min, max: maxmultiplySpeed, step: step, onChange: setMultiplySpeed, id: id, className: className, title: title })
            : React.createElement("p", null, "SpeedRange props error!"));
};
SpeedRange.defaultProps = {
    maxsecperhour: 3600,
    maxmultiplySpeed: 3600,
    min: 1,
    step: 1,
    className: 'harmovis_input_range'
};
export default SpeedRange;
//# sourceMappingURL=speed-range.js.map