import THREE from 'npm:three';
import Shape from './shape';

const RADIUS = 2;
const SEGMENTS = 32;

export default class extends Shape {
  get geometry() {
    if (this._geometry) { return this._geometry; }

    this._geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);

    return this._geometry;
  }
}
