import * as React from 'react';
import { ActionTypes } from '../types';
interface Props {
    actions: ActionTypes;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const LinemapInput: (props: Props) => JSX.Element;
export default LinemapInput;
