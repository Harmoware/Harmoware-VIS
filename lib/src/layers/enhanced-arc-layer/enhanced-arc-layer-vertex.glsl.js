// Inspired by arc-layer vertex shader in deck.gl
export default "#define SHADER_NAME enhanced-arc-layer-vertex-shader\n\nattribute vec3 positions;\nattribute vec4 instanceSourceColors;\nattribute vec4 instanceTargetColors;\nattribute vec4 instancePositions;\nattribute vec3 instancePickingColors;\nattribute float instanceStrokeWidths;\n\n\nuniform float numSegments;\nuniform vec2 viewportSize;\nuniform float opacity;\nuniform float renderPickingBuffer;\n\nvarying vec4 vColor;\n\nfloat paraboloid(vec2 source, vec2 target, float ratio) {\n\n  vec2 x = mix(source, target, ratio);\n  vec2 center = mix(source, target, 0.5);\n\n  float dSourceCenter = distance(source, center);\n  float dXCenter = distance(x, center);\n  return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);\n}\n\n// offset vector by strokeWidth pixels\n// offset_direction is -1 (left) or 1 (right)\nvec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float strokeWidth) {\n  // normalized direction of the line\n  vec2 dir_screenspace = normalize(line_clipspace * viewportSize);\n  // rotate by 90 degrees\n  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);\n\n  vec2 offset_screenspace = dir_screenspace * offset_direction * max(1.0, project_scale(strokeWidth)) / 2.0;\n  vec2 offset_clipspace = offset_screenspace / viewportSize * 2.0;\n\n  return offset_clipspace;\n}\n\nfloat getSegmentRatio(float index) {\n  return smoothstep(0.0, 1.0, index / (numSegments - 1.0));\n}\n\nvec3 getPos(vec2 source, vec2 target, float segmentRatio) {\n  float vertex_height = paraboloid(source, target, segmentRatio);\n\n  return vec3(\n    mix(source, target, segmentRatio),\n    sqrt(max(0.0, vertex_height))\n  );\n}\n\nvoid main(void) {\n  vec2 source = project_position(instancePositions.xy);\n  vec2 target = project_position(instancePositions.zw);\n\n  float segmentIndex = positions.x;\n  float segmentRatio = getSegmentRatio(segmentIndex);\n  // if it's the first point, use next - current as direction\n  // otherwise use current - prev\n  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));\n  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);\n\n  vec3 currPos = getPos(source, target, segmentRatio);\n  vec3 nextPos = getPos(source, target, nextSegmentRatio);\n  vec4 curr = project_to_clipspace(vec4(currPos, 1.0));\n  vec4 next = project_to_clipspace(vec4(nextPos, 1.0));\n\n  // extrude\n  vec2 offset = getExtrusionOffset((next.xy - curr.xy) * indexDir, positions.y, instanceStrokeWidths);\n  gl_Position = curr + vec4(offset, 0.0, 0.0);\n\n  vec4 color = mix(instanceSourceColors, instanceTargetColors, segmentRatio) / 255.;\n\n  vColor = mix(\n    vec4(color.rgb, color.a * opacity),\n    vec4(instancePickingColors / 255., 1.),\n    renderPickingBuffer\n  );\n}\n";
//# sourceMappingURL=enhanced-arc-layer-vertex.glsl.js.map