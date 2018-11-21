
declare module "deck.gl" {
  interface Uniforms {
    extruded: boolean,
    opacity: number,
    coverage: number
  }

  export class Layer <P = {}, S = {}> {
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

  export class CompositeLayer<P = {}, S = {}> extends Layer<P, S> {}

  export class ScatterplotLayer<P = {}, S = {}> extends Layer<P, S> {}

  export class GridCellLayer<P = {}, S = {}> extends Layer<P, S> {}

  export class LineLayer<P = {}, S = {}> extends Layer<P, S> {}

  export class HexagonLayer<P = {}, S = {}> extends Layer<P, S> {}

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
