import * as React from 'react';
import { InputEvent } from '../types';
import { setDepotsBase, setLoading, setInputFilename } from '../actions';
interface Props {
    actions: {
        setDepotsBase: typeof setDepotsBase;
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
export default class DepotsInput extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            formatError: string;
        };
    };
    onSelect(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
