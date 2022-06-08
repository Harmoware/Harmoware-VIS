import * as React from 'react';
import { ActionsInterface } from '../types';
interface Props {
    actions: ActionsInterface;
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
