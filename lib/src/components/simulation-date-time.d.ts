/// <reference types="react" />
interface Props {
    settime: number;
    caption?: string;
    locales?: string;
    options?: object;
    className?: string;
}
declare const SimulationDateTime: {
    (props: Props): JSX.Element;
    defaultProps: {
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
};
export default SimulationDateTime;
