import * as React from 'react';
import { InputEvent } from '../types';
import { setLinemapData, setLoading, setInputFilename } from '../actions';
interface Props {
    actions: {
        setLinemapData: typeof setLinemapData;
        setLoading: typeof setLoading;
        setInputFilename: typeof setInputFilename;
    };
    i18n: {
        formatError: string;
    };
    id: string;
    className: string;
    style: Object;
}
export default class LinemapInput extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            formatError: string;
        };
    };
    onSelect(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
