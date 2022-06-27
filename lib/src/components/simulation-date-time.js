import * as React from 'react';
const SimulationDateTime = (props) => {
    const { settime, caption, locales, options, className } = props;
    const date = new Date(settime * 1000);
    const nbsp = React.useMemo(() => caption.length > 0 ? ' ' : '', [caption]);
    const dateString = date.toLocaleString(locales, options);
    return (React.createElement("span", { className: className, title: `${caption}${nbsp}${dateString}` },
        caption,
        nbsp,
        dateString));
};
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
export default SimulationDateTime;
//# sourceMappingURL=simulation-date-time.js.map