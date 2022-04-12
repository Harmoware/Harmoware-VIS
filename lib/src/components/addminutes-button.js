import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
const AddMinutesButton = (props) => {
    const { addMinutes: prop_addMinutes, children, i18n, className, title: propTitle } = props;
    const title = propTitle || (children && children.toString()) || `${prop_addMinutes} ${i18n.minutesCaption}`;
    const func_addMinutes = (minutes) => {
        props.actions.addMinutes(minutes);
    };
    return (React.createElement("button", { onClick: () => func_addMinutes(prop_addMinutes), className: className, title: title }, children === undefined ?
        React.createElement("span", { style: default_style },
            prop_addMinutes > 0 ?
                React.createElement(Icon, { icon: icFastForward }) : React.createElement(Icon, { icon: icFastRewind }),
            "\u00A0",
            prop_addMinutes,
            "\u00A0",
            i18n.minutesCaption) :
        React.createElement("span", null, children)));
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