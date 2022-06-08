import * as React from 'react';
import { ActionsInterface } from '../types';
interface Props {
    addMinutes?: number;
    children?: React.ReactNode;
    actions: ActionsInterface;
    i18n?: {
        minutesCaption: string;
    };
    className?: string;
    title?: string;
}
declare const AddMinutesButton: {
    (props: Props): JSX.Element;
    defaultProps: {
        addMinutes: number;
        i18n: {
            minutesCaption: string;
        };
        className: string;
    };
};
export default AddMinutesButton;
