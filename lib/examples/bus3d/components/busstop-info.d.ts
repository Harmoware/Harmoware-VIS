import * as React from 'react';
import { Bus3dState } from '../types';
interface Props extends Bus3dState {
    selectedBusstop: string;
    date: number;
}
export default class BusStopInfo extends React.Component<Props> {
    render(): JSX.Element;
}
export {};
