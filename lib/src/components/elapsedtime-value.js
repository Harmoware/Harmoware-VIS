import * as React from 'react';
import { safeCheck, safeAdd, safeSubtract } from '../library';
const { max, min } = Math;
export default class ElapsedTimeValue extends React.Component {
    setTime(e) {
        const value = safeCheck(+e.target.value);
        const { actions, timeBegin, timeLength, min: minimum } = this.props;
        const settime = min(timeLength, max(minimum, value));
        actions.setTime(safeAdd(settime, timeBegin) | 0);
    }
    render() {
        const { settime, timeBegin, timeLength, min, id, className } = this.props;
        return (React.createElement("input", { type: "number", value: safeSubtract(Math.floor(settime), timeBegin) | 0, min: min, max: timeLength, onChange: this.setTime.bind(this), id: id, className: className }));
    }
}
ElapsedTimeValue.defaultProps = {
    min: -100,
    className: 'harmovis_input_number'
};
//# sourceMappingURL=elapsedtime-value.js.map