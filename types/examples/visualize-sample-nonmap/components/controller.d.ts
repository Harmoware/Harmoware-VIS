import * as React from 'react';
import { Actions, InputEvent } from 'harmoware-vis';
interface Props {
    settime?: number;
    timeBegin?: number;
    timeLength?: number;
    secperhour?: number;
    animatePause?: boolean;
    animateReverse?: boolean;
    actions?: typeof Actions;
    t?: Function;
    viewport?: Object;
}
export default class Controller extends React.Component<Props> {
    onLanguageSelect(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
