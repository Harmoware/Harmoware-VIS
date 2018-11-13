export default `\
#define SHADER_NAME enhanced-arc-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
`;
