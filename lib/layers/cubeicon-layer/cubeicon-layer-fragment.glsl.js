"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "#define SHADER_NAME cubeicon-layer-fragment-shader\n\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec4 vColor;\nvarying vec2 vInstanceInfo;\n\nvoid main(void) {\n  if(vInstanceInfo.x <= 0.0 || vInstanceInfo.y <= 0.0){\n    discard;\n  }else{\n    gl_FragColor = vColor;\n\n    // use highlight color if this fragment belongs to the selected object.\n    gl_FragColor = picking_filterHighlightColor(gl_FragColor);\n\n    // use picking color if rendering to picking FBO.\n    gl_FragColor = picking_filterPickingColor(gl_FragColor);\n  }\n}\n";