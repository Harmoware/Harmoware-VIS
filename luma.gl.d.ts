declare module "luma.gl" {
  class IcoSphereGeometry {
    constructor(props?: Object);
  }
  class CubeGeometry {
    constructor(props?: Object);
  }
}

declare module "@luma.gl/core" {
  class PhongMaterial {
    constructor(opts: {ambient: number, diffuse: number, shininess: number, specularColor: number[]});
  }
}

declare module "@luma.gl/addons" {
  const GLTFScenegraphLoader:any
}

declare module "@loaders.gl/core" {
  const registerLoaders:any
}
