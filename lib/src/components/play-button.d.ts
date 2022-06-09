import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    children?: React.ReactNode;
    i18n?: {
        playButtonCaption: string;
    };
    className?: string;
    title?: string;
}
declare const PlayButton: {
    (props: Props): JSX.Element;
    defaultProps: {
        i18n: {
            playButtonCaption: string;
        };
        className: string;
    };
};
export default PlayButton;
