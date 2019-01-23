import * as React from 'react';
import { Bus3dProps } from '../types';
interface Props extends Bus3dProps {
    date: number;
    getOptionChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getArchLayerChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void;
    t: (key: string) => string;
}
interface State {
    filename: string;
}
export default class Controller extends React.Component<Props, State> {
    constructor(props: Props);
    onLanguageSelect(e: React.ChangeEvent<HTMLInputElement>): void;
    onTripSelect(e: React.ChangeEvent<HTMLInputElement>): void;
    onBusSelect(e: React.ChangeEvent<HTMLInputElement>): void;
    onBusstopSelect(e: React.ChangeEvent<HTMLInputElement>): void;
    setDelayRange(e: React.ChangeEvent<HTMLInputElement>): void;
    setCellSize(): void;
    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export {};
