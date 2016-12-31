import THREE from 'npm:three';

export default class {
  constructor(vertexShader, fragmentShader, texture) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.texture = texture;
  }

  get mesh() {
    if (this._mesh) { return this._mesh; }

    let geometry = this.geometry;
    let material = this.material;
    this._mesh = new THREE.Mesh(geometry, material);

    return this._mesh;
  }

  get material() {
    if (this._material) { return this._material; }

    this._material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms
    });

    return this._material;
  }

  get uniforms() {
    if (this._uniforms) { return this._uniforms; }

    this._uniforms = {
      texture: { type: 't', value: this.texture }
    };

    return this._uniforms;
  }

  get geometry() {
    console.warn('Subclasses must implement this method.');
  }

  get rotation() {
    return this.mesh.rotation;
  }

  scale(scale) {
    this.mesh.scale.set(scale, scale, scale);
  }
}
