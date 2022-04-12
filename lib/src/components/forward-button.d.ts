import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
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
