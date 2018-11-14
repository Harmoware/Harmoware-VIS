declare module "deck.gl" {
  interface Uniforms {
    extruded: boolean,
    opacity: number,
    coverage: number
  }

  export class Layer<Props = {}, State = {}> {
    constructor(props: Props);
    context: any;
    props: Props;
    state: State;
    setUniforms(uniforms: Uniforms);
    draw({uniforms: Uniforms});
    setState<K extends keyof State>(
      state: ((prevState: Readonly<State>, props: Readonly<Props>) => (Pick<State, K> | State | null)) | (Pick<State, K> | State | null),
      callback?: () => void
    ): void;
    updateState<K extends keyof State>(
      state: ((prevState: Readonly<State>, props: Readonly<Props>) => (Pick<State, K> | State | null)) | (Pick<State, K> | State | null),
      callback?: () => void
    ): void;
  }


  export class CompositeLayer<Props = {}, State = {}> extends Layer<Props, State> {}

  export class ScatterplotLayer<Props = {}, State = {}> extends Layer<Props, State> {}

  export class GridCellLayer<Props = {}, State = {}> extends Layer<Props, State> {}
}