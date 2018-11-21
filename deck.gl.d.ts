declare module "deck.gl" {
  interface Uniforms {
    extruded: boolean,
    opacity: number,
    coverage: number
  }

  interface Layer<P = {}, S = {}> {
    constructor(props: P);
    context: any;
    props: P;
    state: S;
    setUniforms(uniforms: Uniforms);
    draw({uniforms: Uniforms});
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    updateState(state: {
      props: P,
      oldProps: P,
      changeFlags: any
    }): void;
    onHover: (el: any) => void;
    onClick: (el: any) => void;
  }

  export class Layer<P = {}, S = {}> {}

  export class CompositeLayer<P = {}, S = {}> extends Layer<P, S> {}

  export class ScatterplotLayer<P = {}, S = {}> extends Layer<P, S> {}

  
  interface GridCellLayerProps {
    layerRadiusScale?: number,
    layerOpacity?: number,
    optionVisible?: boolean,
    optionChange?: boolean,
    optionOpacity?: number,
    optionCellSize?: number,
    optionElevationScale?: number,
    visible?: boolean,
    getColor?: (x: any) => Array<number>,
    getRadius?: (x: any) => number,
    getColor1?: (x: any) => Array<number>,
    getColor2?: (x: any) => Array<number>,
    getColor3?: (x: any) => Array<number>,
    getColor4?: (x: any) => Array<number>,
    getElevation1?: (x: any) => number,
    getElevation2?: (x: any) => number,
    getElevation3?: (x: any) => number,
    getElevation4?: (x: any) => number,
    getCubeColor?: (x: any) => Array<Array<number>>,
    getCubeElevation?: (x: any) => Array<number>,
    onHover?: (el: any) => void,
    onClick?: (el: any) => void,
  }
  export class GridCellLayer<GridCellLayerProps, S = {}> extends Layer {}

  export class LineLayer<P = {}, S = {}> extends Layer<P, S> {}

  export default class DeckGL<P = {}, S = {}> extends React.Component<P, S> {}

  export const COORDINATE_SYSTEM;
  export const experimental;
  
  interface PerspectiveViewportOption {
    width: number; 
    height: number; 
    lookAt: number[]; 
    far:number; 
    near: number; 
    fovy: number; 
    eye: any;
  }

  export class PerspectiveViewport {
    constructor(props: PerspectiveViewportOption);
  }
}