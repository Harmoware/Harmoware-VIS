import * as React from 'react';
import { setAnimatePause } from '../actions';
interface Props {
    actions: {
        setAnimatePause: typeof setAnimatePause;
    };
    children: Element;
    i18n: {
        pauseButtonCaption: string;
    };
    className: string;
}
export default class PauseButton extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            pauseButtonCaption: string;
        };
        className: string;
    };
    setAnimatePause(): void;
    render(): JSX.Element;
}
export {};
