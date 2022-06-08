import * as React from 'react';
import { ActionsInterface } from '../types';
interface Props {
    actions: ActionsInterface;
    i18n?: {
        formatError: string;
    };
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const DepotsInput: {
    (props: Props): JSX.Element;
    defaultProps: {
        i18n: {
            formatError: string;
        };
    };
};
export default DepotsInput;
