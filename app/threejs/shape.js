import THREE from 'npm:three';

export default class {
  constructor(vertexShader, fragmentShader, texture) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.texture = texture;
    this.clock = new THREE.Clock();
    this.partyMode = 0;
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
    return {
      uTexture: { type: 't', value: this.texture },
      uPartyMode: { type: 'i', value: 0 },
      uTime: { type: 'f', value: this.time }
    };
  }

  get geometry() {
    console.warn('Subclasses must implement this method.');
  }

  get rotation() {
    return this.mesh.rotation;
  }

  get time() {
    if (!this._time) { this._time = 1.0; }
    this._time += this.clock.getDelta();
    return this._time;
  }

  scale(scale) {
    this.mesh.scale.set(scale, scale, scale);
  }

  updateUniforms() {
    this.mesh.material.uniforms.uTime.value = this.time;
    this.mesh.material.uniforms.uPartyMode.value = this.partyMode;
  }
}
