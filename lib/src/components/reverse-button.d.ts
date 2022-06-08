import * as React from 'react';
import { ActionsInterface } from '../types';
interface Props {
    actions: ActionsInterface;
    children?: React.ReactNode;
    i18n?: {
        reverseButtonCaption: string;
    };
    className?: string;
    title?: string;
}
declare const ReverseButton: {
    (props: Props): JSX.Element;
    defaultProps: {
        i18n: {
            reverseButtonCaption: string;
        };
        className: string;
    };
};
export default ReverseButton;
