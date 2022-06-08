import * as React from 'react';
import { ActionsInterface } from '../types';
interface Props {
    actions: ActionsInterface;
    children?: React.ReactNode;
    i18n?: {
        pauseButtonCaption: string;
    };
    className?: string;
    title?: string;
}
declare const PauseButton: {
    (props: Props): JSX.Element;
    defaultProps: {
        i18n: {
            pauseButtonCaption: string;
        };
        className: string;
    };
};
export default PauseButton;
