declare module "luma.gl" {
  interface Uniforms {}
  const GL: { UNSIGNED_BYTE: number, TRIANGLE_STRIP: number, TRIANGLES: number }
  class Geometry {
    constructor(opts: { drawMode: any, positions: Float32Array });
  }
  class Model {
    constructor(gl: WebGLRenderingContext, opts: object);
    render(uniforms: Uniforms, attributes?: any, parameters?: any, samplers?: any): this;
    setUniforms(uniforms: Uniforms): this;
  }
  class CubeGeometry extends Geometry {
    constructor(opts?: { drawMode: any, positions: Float32Array });
  }
  const picking: { name: 'picking' }
  function registerShaderModules(shaderModuleList: any[], { ignoreMultipleRegistrations }?: {
    ignoreMultipleRegistrations?: boolean;
  }): void
}
