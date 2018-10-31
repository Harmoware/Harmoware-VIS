// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export default `\
#define SHADER_NAME front-scatterplot-layer-vertex-shader

attribute vec3 positions;

attribute vec3 instancePositions;
attribute float instanceRadius;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float renderPickingBuffer;
uniform float outline;
uniform float strokeWidth;

varying vec4 vColor;
varying vec3 unitPosition;
varying float innerUnitRadius;

void main(void) {
  // Multiply out radius and clamp to limits
  float outerRadiusPixels = clamp(
    project_scale(radiusScale * instanceRadius),
    radiusMinPixels, radiusMaxPixels
  );
  // outline is centered at the radius
  // outer radius needs to offset by half stroke width
  outerRadiusPixels += outline * strokeWidth / 2.0;

  // position on the containing square in [-1, 1] space
  unitPosition = positions;
  // 0 - solid circle, 1 - stroke with lineWidth=0
  innerUnitRadius = outline * (1.0 - strokeWidth / outerRadiusPixels);

  // Find the center of the point and add the current vertex
  vec3 center = project_position(instancePositions);
  vec3 vertex = positions * outerRadiusPixels;
  gl_Position = project_to_clipspace(vec4(center + vertex, 1.0));

  // Apply opacity to instance color, or return instance picking color
  vec4 color = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.;
  vec4 pickingColor = vec4(instancePickingColors / 255., 1.);
  vColor = mix(color, pickingColor, renderPickingBuffer);
}
`;
