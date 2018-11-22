import * as React from 'react';
import { Bus3dActions } from '../types';
import { InputEvent } from 'harmoware-vis';
interface Props {
    actions: typeof Bus3dActions;
}
interface State {
    filename: string;
}
export default class XbandDataInput extends React.Component<Props, State> {
    constructor(props: Props);
    onSelect(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
