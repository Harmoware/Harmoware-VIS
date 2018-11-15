import * as React from 'react';
import { InputEvent } from '../types';
import { setMovesBase, setRoutePaths, setClicked, setAnimatePause, setAnimateReverse, setLoading, setInputFilename } from '../actions';
interface Props {
    actions: {
        setMovesBase: typeof setMovesBase;
        setRoutePaths: typeof setRoutePaths;
        setClicked: typeof setClicked;
        setAnimatePause: typeof setAnimatePause;
        setAnimateReverse: typeof setAnimateReverse;
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
export default class MovesInput extends React.Component<Props> {
    static defaultProps: {
        i18n: {
            formatError: string;
        };
    };
    onSelect(e: InputEvent): void;
    render(): JSX.Element;
}
export {};
