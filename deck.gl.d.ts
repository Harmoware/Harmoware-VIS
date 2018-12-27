import * as React from 'react';
import { Layer as OrgLayer, AttributeManager as OrgAttributeManager } from 'deck.gl';
import { vec3 } from 'gl-matrix';
import { number } from 'prop-types';

declare module "deck.gl" {
  interface Uniforms {
    extruded: boolean,
    opacity: number,
    coverage: number
  }

  class Layer <P = {}, S = {}> implements OrgLayer {
    constructor(props: P);
    context;
    props: P;
    state: S;
    setUniforms(uniforms: Uniforms);
    draw({uniforms}:{uniforms: Uniforms});
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    updateState(state: {
      props: P,
      oldProps: P,
      changeFlags,
    }): void;
    onHover: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }

  class CompositeLayer<P = {}, S = {}> extends Layer<P, S> {}

  class ScatterplotLayer<P = {}, S = {}> extends Layer<P, S> {}

  class GridCellLayer<P = {}, S = {}> extends Layer<P, S> {}

  class LineLayer<P = {}, S = {}> extends Layer<P, S> {}

  class HexagonLayer<P = {}, S = {}> extends Layer<P, S> {}

  class AttributeManager implements OrgAttributeManager {
    addInstanced(attributes: object, updaters?: object): void;
  }

  class DeckGL<P = {}, S = {}> extends React.Component<P, S> {}

  const COORDINATE_SYSTEM: { IDENTITY: number };
  const experimental: {
    get: (container: object, compositeKey: string | any) => any;
}
  
  interface PerspectiveViewportOption {
    width: number; 
    height: number; 
    lookAt: number[]; 
    far:number; 
    near: number; 
    fovy: number; 
    eye: vec3;
  }

  class PerspectiveViewport {
    constructor(props: PerspectiveViewportOption);
  }
}
