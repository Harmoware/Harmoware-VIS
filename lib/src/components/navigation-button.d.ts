/// <reference types="react" />
import { ActionTypes, Viewport } from '../types';
interface Props {
    buttonType: string;
    actions: ActionTypes;
    viewport: Viewport;
    className?: string;
    title?: string;
}
declare const NavigationButton: {
    (props: Props): JSX.Element;
    defaultProps: {
        className: string;
    };
};
export default NavigationButton;
