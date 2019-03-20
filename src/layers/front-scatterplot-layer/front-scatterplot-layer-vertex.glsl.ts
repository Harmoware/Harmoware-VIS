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
attribute vec2 instancePositions64xyLow;
attribute float instanceRadius;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float lineWidthScale;
uniform float lineWidthMinPixels;
uniform float lineWidthMaxPixels;
uniform float stroked;
uniform bool filled;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec3 unitPosition;
varying float innerUnitRadius;

void main(void) {
  // Multiply out radius and clamp to limits
  float outerRadiusPixels = clamp(
    project_scale(radiusScale * instanceRadius),
    radiusMinPixels, radiusMaxPixels
  );
  
  // Multiply out line width and clamp to limits
  float lineWidth = clamp(
    project_scale(lineWidthScale * instanceLineWidths), 
    lineWidthMinPixels, lineWidthMaxPixels
  );

  // outer radius needs to offset by half stroke width
  outerRadiusPixels += stroked * lineWidth / 2.0;

  // position on the containing square in [-1, 1] space
  unitPosition = positions;

  innerUnitRadius = 1.0 - stroked * lineWidth / outerRadiusPixels;
  
  vec3 offset = positions * outerRadiusPixels;
  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xyLow, offset);

  // Apply opacity to instance color, or return instance picking color
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity) / 255.;
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity) / 255.;
  
  // Set color to be rendered to picking fbo (also used to check for selection highlight).
  picking_setPickingColor(instancePickingColors);
}
`;
