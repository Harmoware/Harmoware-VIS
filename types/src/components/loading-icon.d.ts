import * as React from 'react';
interface Props {
    loading: boolean;
    color: string;
}
export default class LoadingIcon extends React.Component<Props> {
    static defaultProps: {
        loading: boolean;
        color: string;
    };
    render(): JSX.Element;
}
export {};
