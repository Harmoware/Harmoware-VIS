import * as React from 'react';
import { safeCheck, safeAdd, safeSubtract } from '../library';
export default class ElapsedTimeRange extends React.Component {
    setTime(e) {
        const { actions, timeBegin } = this.props;
        const value = safeCheck(+e.target.value);
        actions.setTime(safeAdd(value, timeBegin) | 0);
    }
    render() {
        const { settime, timeBegin, timeLength, min, step, id, className, title: propTitle } = this.props;
        const title = propTitle || `${safeSubtract(settime, timeBegin) | 0}`;
        return (React.createElement("input", { type: "range", value: safeSubtract(settime, timeBegin) | 0, min: min, max: timeLength, step: step, onChange: this.setTime.bind(this), id: id, className: className, title: title }));
    }
}
ElapsedTimeRange.defaultProps = {
    min: -100,
    step: 1,
    className: 'harmovis_input_range'
};
//# sourceMappingURL=elapsedtime-range.js.map