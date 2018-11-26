import * as React from 'react';
import { Bus3dProps } from '../types';
interface Props extends Bus3dProps {
    date: number;
}
export default class Header extends React.Component<Props> {
    onBusReleaseClick(): void;
    setDelayHeight(e: any): void;
    setScaleElevation(e: any): void;
    render(): JSX.Element;
}
export {};
