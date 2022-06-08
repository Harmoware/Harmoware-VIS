import * as React from 'react';
import { ActionsInterface } from '../types';
interface Props {
    actions: ActionsInterface;
    children?: React.ReactNode;
    i18n?: {
        forwardButtonCaption: string;
    };
    className?: string;
    title?: string;
}
declare const ForwardButton: {
    (props: Props): JSX.Element;
    defaultProps: {
        i18n: {
            forwardButtonCaption: string;
        };
        className: string;
    };
};
export default ForwardButton;
