import THREE from 'npm:three';
import Shape from './shape';

const SIZE = 2;

export default class extends Shape {
  get geometry() {
    if (this._geometry) { return this._geometry; }

    this._geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);

    return this._geometry;
  }
}
