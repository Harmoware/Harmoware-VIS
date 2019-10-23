declare module "deck.gl" {

  import * as React from 'react';
  import DeckGL from '@deck.gl/react';
  import { Layer } from '@deck.gl/core';
  import { CompositeLayer, ScatterplotLayer, GridCellLayer, LineLayer,
    HexagonLayer, ArcLayer, PolygonLayer, AttributeManager } from '@deck.gl/layers';
  import { vec3 } from 'gl-matrix';
  import { number } from 'prop-types';

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
    coordinateSystem?: number;
  }

  export default class DeckGL extends React.Component<any> {}

  class CompositeLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class ScatterplotLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class GridCellLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class LineLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class HexagonLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class ArcLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class PolygonLayer<P extends LayerProps = LayerProps, S = {}> extends CompositeLayer<P, S> {}

  class AttributeManager {
    addInstanced(attributes: object, updaters?: object): void;
  }
}

declare module "@deck.gl/core" {

  import * as React from 'react';
  import { Uniforms, LayerProps } from 'deck.gl';

  class Layer <P extends LayerProps = LayerProps, S = {}> {
    constructor(props: P);
    context: any;
    props: P;
    state: S;
    setUniforms(uniforms: Uniforms): any;
    draw({uniforms}:{uniforms: Uniforms}): any;
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    updateState(state: {
      props: P,
      oldProps: P,
      changeFlags: any,
    }): void;
  }
}
