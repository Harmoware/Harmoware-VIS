/* global window */
import * as React from 'react';
import { PerspectiveViewport } from 'deck.gl';
import { vec3 } from 'gl-matrix';
import { Viewport } from '../types';

/* Utils */

// constrain number between bounds
function clamp(x, min, max) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}

const ua = typeof window.navigator !== 'undefined' ?
  window.navigator.userAgent.toLowerCase() : '';
const firefox = ua.indexOf('firefox') !== -1;

interface customViewport extends Viewport {
  isDragging?: boolean,
}
interface Props extends customViewport {
  children?: React.ReactNode,
  ref?: (canvas) => void,
  onViewportChange?: (customViewport) => void
}

export default class OrbitController extends React.Component<Props>{

  dragStartPos: null | [number, number];

  static getViewport(viewport: Viewport) {
    const { width, height, lookAt, distance, rotationX, rotationY, fov } = viewport;
    const outvec3 = vec3.create();
    const cameraPos = vec3.add(outvec3, lookAt, [0, 0, distance]);
    vec3.rotateX(cameraPos, cameraPos, lookAt, (rotationX / 180) * Math.PI);
    vec3.rotateY(cameraPos, cameraPos, lookAt, (rotationY / 180) * Math.PI);

    return new PerspectiveViewport({
      width,
      height,
      lookAt,
      far: 1000,
      near: 0.1,
      fovy: fov,
      eye: cameraPos
    });
  }

  constructor(props: Props) {
    super(props);
    this.dragStartPos = null;
  }

  static defaultProps = {
    lookAt: [0, 0, 0],
    rotationX: 0,
    rotationY: 0,
    minDistance: 0,
    maxDistance: Infinity,
    fov: 50
  };

  onDragStart(evt: React.MouseEvent<HTMLDivElement>) {
    const { pageX, pageY } = evt;
    this.dragStartPos = [pageX, pageY];
    this.props.onViewportChange({ isDragging: true });
  }

  onDrag(evt: React.MouseEvent<HTMLDivElement>) {
    if (this.dragStartPos) {
      const { pageX, pageY } = evt;
      const { width, height } = this.props;
      const dx = (pageX - this.dragStartPos[0]) / width;
      const dy = (pageY - this.dragStartPos[1]) / height;

      if (evt.shiftKey || evt.ctrlKey || evt.altKey || evt.metaKey) {
        // rotate
        const { rotationX } = this.props;
        const newRotationX = clamp(rotationX - (dy * 180), 0, 90);

        this.props.onViewportChange({
          rotationX: newRotationX
        });
      } else {
        // pan
        const { lookAt, distance, fov } = this.props;

        const unitsPerPixel = distance / Math.tan(((fov / 180) * Math.PI) / 2) / 2;

        const outvec3 = vec3.create();
        const newLookAt = vec3.add(outvec3, lookAt, [-unitsPerPixel * dx, unitsPerPixel * dy, 0]);

        this.props.onViewportChange({
          lookAt: newLookAt
        });
      }

      this.dragStartPos = [pageX, pageY];
    }
  }

  onDragEnd(evt: React.MouseEvent<HTMLDivElement>) {
    this.dragStartPos = null;
    this.props.onViewportChange({ isDragging: false });
  }

  onWheel(evt: React.WheelEvent<HTMLDivElement>) {
    evt.preventDefault();
    let value = evt.deltaY;
    // Firefox doubles the values on retina screens...
    if (firefox && evt.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL) {
      value /= window.devicePixelRatio;
    }
    if (evt.deltaMode === window.WheelEvent.DOM_DELTA_LINE) {
      value *= 40;
    }
    if (value !== 0 && value % 4.000244140625 === 0) {
      // This one is definitely a mouse wheel event.
      // Normalize this value to match trackpad.
      value = Math.floor(value / 4);
    }

    const { distance, minDistance, maxDistance } = this.props;
    const newDistance = clamp(distance * (1.001 ** value), minDistance, maxDistance);

    this.props.onViewportChange({
      distance: newDistance
    });
  }

  render() {
    return (
      <div
        style={{ position: 'relative', userSelect: 'none' }}
        onMouseDown={this.onDragStart.bind(this)}
        onMouseMove={this.onDrag.bind(this)}
        onMouseLeave={this.onDragEnd.bind(this)}
        onMouseUp={this.onDragEnd.bind(this)}
        onWheel={this.onWheel.bind(this)}
      >
        {this.props.children}
      </div>
    );
  }
}
