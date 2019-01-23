import * as React from 'react';
import { BasedProps, Viewport } from 'harmoware-vis';
interface Props extends BasedProps {
    t: (key: string) => string;
    viewport: Viewport;
}
export default class Controller extends React.Component<Props> {
    onLanguageSelect(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export {};
