import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const AddMinutesButton = (props) => {
    const { addMinutes: prop_addMinutes, children, i18n, className, title: propTitle } = props;
    const defaultCaption = React.useMemo(() => React.createElement("span", { style: default_style },
        prop_addMinutes > 0 ? React.createElement(Icon, { icon: icFastForward }) : React.createElement(Icon, { icon: icFastRewind }),
        ` ${prop_addMinutes} ${i18n.minutesCaption}`), [i18n.minutesCaption]);
    const func_addMinutes = (minutes) => {
        props.actions.addMinutes(minutes);
    };
    const Result = React.useMemo(() => React.createElement("button", { onClick: () => func_addMinutes(prop_addMinutes), className: className, title: propTitle || (children && children.toString()) || `${prop_addMinutes} ${i18n.minutesCaption}` }, children === undefined ? React.createElement(React.Fragment, null, defaultCaption) : React.createElement("span", null, children)), [props]);
    return Result;
};
AddMinutesButton.defaultProps = {
    addMinutes: 10,
    i18n: {
        minutesCaption: 'min'
    },
    className: 'harmovis_button'
};
export default AddMinutesButton;
//# sourceMappingURL=addminutes-button.js.map