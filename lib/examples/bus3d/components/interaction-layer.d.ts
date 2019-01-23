/// <reference types="react" />
import { Viewport } from 'harmoware-vis';
import { Bus3dEventInfo } from '../types';
interface Props {
    viewport: Viewport;
    hovered: Bus3dEventInfo;
}
declare const _default: ({ viewport, hovered }: Props) => JSX.Element;
export default _default;
