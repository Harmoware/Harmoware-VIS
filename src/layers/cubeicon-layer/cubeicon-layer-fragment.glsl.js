export default `\
#define SHADER_NAME cubeicon-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec2 vInstanceInfo;

void main(void) {
  if(vInstanceInfo.x <= 0.0 || vInstanceInfo.y <= 0.0){
    discard;
  }else{
    gl_FragColor = vColor;

    // use highlight color if this fragment belongs to the selected object.
    gl_FragColor = picking_filterHighlightColor(gl_FragColor);

    // use picking color if rendering to picking FBO.
    gl_FragColor = picking_filterPickingColor(gl_FragColor);
  }
}
`;
