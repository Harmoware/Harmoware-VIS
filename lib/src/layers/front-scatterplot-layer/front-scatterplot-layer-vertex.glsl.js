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
export default "#define SHADER_NAME front-scatterplot-layer-vertex-shader\n\nattribute vec3 positions;\n\nattribute vec3 instancePositions;\nattribute float instanceRadius;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\n\nuniform float opacity;\nuniform float radiusScale;\nuniform float radiusMinPixels;\nuniform float radiusMaxPixels;\nuniform float renderPickingBuffer;\nuniform float outline;\nuniform float strokeWidth;\n\nvarying vec4 vColor;\nvarying vec3 unitPosition;\nvarying float innerUnitRadius;\n\nvoid main(void) {\n  // Multiply out radius and clamp to limits\n  float outerRadiusPixels = clamp(\n    project_scale(radiusScale * instanceRadius),\n    radiusMinPixels, radiusMaxPixels\n  );\n  // outline is centered at the radius\n  // outer radius needs to offset by half stroke width\n  outerRadiusPixels += outline * strokeWidth / 2.0;\n\n  // position on the containing square in [-1, 1] space\n  unitPosition = positions;\n  // 0 - solid circle, 1 - stroke with lineWidth=0\n  innerUnitRadius = outline * (1.0 - strokeWidth / outerRadiusPixels);\n\n  // Find the center of the point and add the current vertex\n  vec3 center = project_position(instancePositions);\n  vec3 vertex = positions * outerRadiusPixels;\n  gl_Position = project_to_clipspace(vec4(center + vertex, 1.0));\n\n  // Apply opacity to instance color, or return instance picking color\n  vec4 color = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.;\n  vec4 pickingColor = vec4(instancePickingColors / 255., 1.);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n";
//# sourceMappingURL=front-scatterplot-layer-vertex.glsl.js.map