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
export default "#define SHADER_NAME front-scatterplot-layer-vertex-shader\n\nattribute vec3 positions;\n\nattribute vec3 instancePositions;\nattribute vec2 instancePositions64xyLow;\nattribute float instanceRadius;\nattribute float instanceLineWidths;\nattribute vec4 instanceFillColors;\nattribute vec4 instanceLineColors;\nattribute vec3 instancePickingColors;\n\nuniform float opacity;\nuniform float radiusScale;\nuniform float radiusMinPixels;\nuniform float radiusMaxPixels;\nuniform float lineWidthScale;\nuniform float lineWidthMinPixels;\nuniform float lineWidthMaxPixels;\nuniform float stroked;\nuniform bool filled;\n\nvarying vec4 vFillColor;\nvarying vec4 vLineColor;\nvarying vec3 unitPosition;\nvarying float innerUnitRadius;\n\nvoid main(void) {\n  // Multiply out radius and clamp to limits\n  float outerRadiusPixels = clamp(\n    project_scale(radiusScale * instanceRadius),\n    radiusMinPixels, radiusMaxPixels\n  );\n  \n  // Multiply out line width and clamp to limits\n  float lineWidth = clamp(\n    project_scale(lineWidthScale * instanceLineWidths), \n    lineWidthMinPixels, lineWidthMaxPixels\n  );\n\n  // outer radius needs to offset by half stroke width\n  outerRadiusPixels += stroked * lineWidth / 2.0;\n\n  // position on the containing square in [-1, 1] space\n  unitPosition = positions;\n\n  innerUnitRadius = 1.0 - stroked * lineWidth / outerRadiusPixels;\n  \n  vec3 offset = positions * outerRadiusPixels;\n  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xyLow, offset);\n\n  // Apply opacity to instance color, or return instance picking color\n  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity) / 255.;\n  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity) / 255.;\n  \n  // Set color to be rendered to picking fbo (also used to check for selection highlight).\n  picking_setPickingColor(instancePickingColors);\n}\n";
//# sourceMappingURL=front-scatterplot-layer-vertex.glsl.js.map