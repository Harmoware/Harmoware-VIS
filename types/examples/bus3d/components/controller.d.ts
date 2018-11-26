import * as React from 'react';
import { Bus3dProps } from '../types';
import { InputEvent } from 'harmoware-vis';
interface Props extends Bus3dProps {
    date: number;
    getOptionChangeChecked: (event: any) => void;
    getArchLayerChangeChecked: (event: any) => void;
}
interface State {
    filename: string;
}
export default class Controller extends React.Component<Props, State> {
    constructor(props: Props);
    onTripSelect(e: InputEvent): void;
    onBusSelect(e: InputEvent): void;
    onBusstopSelect(e: InputEvent): void;
    setDelayRange(e: InputEvent): void;
    setCellSize(): void;
    handleChangeFile(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
