/// <reference types="react" />
interface Props {
    width?: number;
    height?: number;
    colorCode?: string;
    className?: string;
    UnitCaption?: string;
}
declare const FpsDisplay: {
    (props: Props): JSX.Element;
    defaultProps: {
        width: number;
        height: number;
        colorCode: string;
        className: string;
        UnitCaption: string;
    };
    frameCounter: number;
};
export default FpsDisplay;
