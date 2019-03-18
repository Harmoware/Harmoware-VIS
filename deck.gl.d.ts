import * as React from 'react';
import { Layer as OrgLayer } from '@deck.gl/core';
import { AttributeManager as OrgAttributeManager } from 'deck.gl';
import { vec3 } from 'gl-matrix';
import { number } from 'prop-types';

declare module "deck.gl" {

  interface Uniforms {
    extruded: boolean,
    opacity: number,
    coverage: number
  }
  interface LayerProps {
    id?: string;
    data?: any[];
    visible?: boolean;
    pickable?: boolean;
    opacity?: number;
    onHover?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    projectionMode?: number;
  }

  class Layer <P extends LayerProps = LayerProps, S = {}> implements OrgLayer {
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

  export default class DeckGL extends React.Component<{layers: Layer[], onWebGLInitialized: (gl: WebGLRenderingContext) => void, width?: number, height?: number, viewport?: PerspectiveViewport}> {}

  class CompositeLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class ScatterplotLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class GridCellLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class LineLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class HexagonLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class ArcLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class AttributeManager implements OrgAttributeManager {
    addInstanced(attributes: object, updaters?: object): void;
  }

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
