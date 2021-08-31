import * as React from 'react';
export default class SimulationDateTime extends React.Component {
    render() {
        const { settime, caption, locales, options, className } = this.props;
        const date = new Date(settime * 1000);
        const nbsp = caption.length > 0 ? ' ' : '';
        return (React.createElement("span", { className: className, title: `${caption}${nbsp}${date.toLocaleString(locales, options)}` },
            caption,
            nbsp,
            date.toLocaleString(locales, options)));
    }
}
SimulationDateTime.defaultProps = {
    caption: '',
    locales: 'ja-JP',
    options: { year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short' },
};
//# sourceMappingURL=simulation-date-time.js.map