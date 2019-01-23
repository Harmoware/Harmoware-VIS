import * as React from 'react';
import { BasedProps, ClickedObject, RoutePaths } from 'harmoware-vis';
interface Props extends BasedProps {
    deleteMovebase?: (maxKeepSecond: number) => void;
    getMoveDataChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getMoveOptionChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getDepotOptionChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getOptionChangeChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface State {
    currentGroupindex: number;
    routeGroupDisplay: boolean;
    saveRouteGroup: {
        clickedObject: ClickedObject[];
        routePaths: RoutePaths[];
    }[];
}
export default class Controller extends React.Component<Props, State> {
    constructor(props: Props);
    deleteMovebase(maxKeepSecond: number): void;
    clearAllRoute(): void;
    saveRouteGroup(): void;
    displayRouteGroup(): void;
    deleteRouteGroup(): void;
    render(): JSX.Element;
}
export {};
