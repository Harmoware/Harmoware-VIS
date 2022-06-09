import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    addMinutes?: number;
    children?: React.ReactNode;
    actions: ActionTypes;
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
