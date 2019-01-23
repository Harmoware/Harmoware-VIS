import * as React from 'react';
import { Bus3dActions } from '../types';
interface Props {
    actions: typeof Bus3dActions;
    t: (key: string) => string;
}
interface State {
    filename: string;
}
export default class XbandDataInput extends React.Component<Props, State> {
    constructor(props: Props);
    onSelect(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export {};
