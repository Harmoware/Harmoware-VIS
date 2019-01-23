import * as React from 'react';
import { Bus3dProps } from '../types';
interface Props extends Bus3dProps {
    t: (key: string) => string;
}
export default class Header extends React.Component<Props> {
    onBusReleaseClick(): void;
    setDelayHeight(e: React.ChangeEvent<HTMLInputElement>): void;
    setScaleElevation(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export {};
