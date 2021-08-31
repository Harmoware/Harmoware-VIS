import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
const default_style = { 'display': 'flex', 'justifyContent': 'center' };
export default class AddMinutesButton extends React.Component {
    addMinutes(minutes) {
        this.props.actions.addMinutes(minutes);
    }
    render() {
        const { addMinutes, children, i18n, className, title: propTitle } = this.props;
        const title = propTitle || (children && children.toString()) || `${addMinutes} ${i18n.minutesCaption}`;
        return (React.createElement("button", { onClick: this.addMinutes.bind(this, addMinutes), className: className, title: title }, children === undefined ?
            React.createElement("span", { style: default_style },
                addMinutes > 0 ?
                    React.createElement(Icon, { icon: icFastForward }) : React.createElement(Icon, { icon: icFastRewind }),
                "\u00A0",
                addMinutes,
                "\u00A0",
                i18n.minutesCaption) :
            React.createElement("span", null, children)));
    }
}
AddMinutesButton.defaultProps = {
    addMinutes: 10,
    i18n: {
        minutesCaption: 'min'
    },
    className: 'harmovis_button'
};
//# sourceMappingURL=addminutes-button.js.map