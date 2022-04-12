/// <reference types="react" />
interface Props {
    loading?: boolean;
    color?: string;
}
declare const LoadingIcon: {
    (props: Props): JSX.Element;
    defaultProps: {
        loading: boolean;
        color: string;
    };
};
export default LoadingIcon;
