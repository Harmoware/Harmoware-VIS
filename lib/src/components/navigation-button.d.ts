/// <reference types="react" />
import { ActionsInterface, Viewport } from '../types';
interface Props {
    buttonType: string;
    actions: ActionsInterface;
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
