import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    i18n?: {
        formatError: string;
    };
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const LinemapInput: {
    (props: Props): JSX.Element;
    defaultProps: {
        i18n: {
            formatError: string;
        };
    };
};
export default LinemapInput;
