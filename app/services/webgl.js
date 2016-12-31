import Ember from 'ember';
import THREE from 'npm:three';

export default Ember.Service.extend({
  init() {
    this.set('renderer', new THREE.WebGLRenderer({ alpha: true }));
  }
});
