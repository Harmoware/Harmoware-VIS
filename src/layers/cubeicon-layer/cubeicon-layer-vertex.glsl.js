// Inspired by screen-grid-layer vertex shader in deck.gl

export default `\
#define SHADER_NAME cubeicon-layer-vertex-shader

attribute vec3 positions;
attribute vec3 normals;

attribute vec4 instancePositions;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;

// Custom uniforms
uniform float extruded;
uniform float cellSize;
uniform float coverage;
uniform float opacity;

// A magic number to scale elevation so that 1 unit approximate to 1 meter
#define ELEVATION_SCALE 0.5

// Result
varying vec4 vColor;
varying vec2 vInstanceInfo;

void main(void) {

  vec4 topLeftPos = project_position(instancePositions);

  // if ahpha == 0.0 or z < 0.0, do not render element
  float noRender = float(instanceColors.a == 0.0 || instancePositions.w < 0.0);
  float finalCellSize = cellSize * mix(1.0, 0.0, noRender);
  float center = finalCellSize / 2.0;

  // cube gemoetry vertics are between -1 to 1, scale and transform it to between 0, 1
  vec3 pos = vec3(vec2(topLeftPos.xy + vec2(
    (positions.x * coverage + 1.0) / 2.0 * finalCellSize,
    (positions.y * coverage - 1.0) / 2.0 * finalCellSize) + vec2(center * -1.0, center)),
    topLeftPos.z);

  float elevation = 0.0;

  if (extruded > 0.5) {
    elevation = project_scale(topLeftPos.w  * (positions.z + 1.0) * ELEVATION_SCALE);
  }

  // extrude positions
  vec4 position_worldspace = vec4(pos.xy, elevation + pos.z + 1.0, 1.0);
  gl_Position = project_to_clipspace(position_worldspace);

  float lightWeight = 1.0;

  if (extruded > 0.5) {
    lightWeight = getLightWeight(
      position_worldspace.xyz, // the w component is always 1.0
      normals
    );
  }

  vec3 lightWeightedColor = lightWeight * instanceColors.rgb;
  vec4 color = vec4(lightWeightedColor, instanceColors.a * opacity) / 255.0;
  vColor = color;
  vInstanceInfo = vec2(instanceColors.a,instancePositions.w);

  // Set color to be rendered to picking fbo (also used to check for selection highlight).
  picking_setPickingColor(instancePickingColors);
}
`;
