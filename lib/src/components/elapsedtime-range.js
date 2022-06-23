import * as React from 'react';
import { safeCheck, safeAdd, safeSubtract } from '../library';
const ElapsedTimeRange = (props) => {
    const { actions, settime, timeBegin, timeLength, min, step, id, className, title: propTitle } = props;
    const title = propTitle || `${safeSubtract(settime, timeBegin) | 0}`;
    const setTime = (e) => {
        const value = safeCheck(+e.target.value);
        actions.setTime(safeAdd(value, timeBegin) | 0);
    };
    return (React.createElement("input", { type: "range", value: safeSubtract(settime, timeBegin) | 0, min: min, max: timeLength, step: step, onChange: setTime, id: id, className: className, title: title }));
};
ElapsedTimeRange.defaultProps = {
    min: -100,
    step: 1,
    className: 'harmovis_input_range'
};
export default ElapsedTimeRange;
//# sourceMappingURL=elapsedtime-range.js.map