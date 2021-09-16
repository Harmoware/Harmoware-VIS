import * as React from 'react';
interface Props {
    settime: number;
    caption?: string;
    locales?: string;
    options?: object;
    className?: string;
}
export default class SimulationDateTime extends React.Component<Props> {
    static defaultProps: {
        caption: string;
        locales: string;
        options: {
            year: string;
            month: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
            weekday: string;
        };
    };
    render(): JSX.Element;
}
export {};
