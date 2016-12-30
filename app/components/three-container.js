import Ember from 'ember';
import THREE from 'npm:three';
import shaders from 'threejs-in-ember/ember-stringify';
import Cube from '../threejs/cube';

const CAMERA_FOV = 75;
const CAMERA_DISTANCE = 5;
const CAMERA_NEAR_PLANE = 0.1;
const CAMERA_FAR_PLANE = 1000.0;

// TODO: party mode, dragging, netlify, ember-concurrency

export default Ember.Component.extend({
  vertexShader: shaders['vertex.glsl'],
  fragmentShader: shaders['fragment.glsl'],
  classNames: ['three-container'],

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', () => {
      this.configureScene();
    });
  },

  configureScene() {
    let glRenderer = this.get('glRenderer');
    this.get('element').appendChild(glRenderer.domElement);

    let loader = new THREE.TextureLoader();
    loader.load('ember-logo.png', (texture) => {
      if (this.isDestroyed || this.isDestroying) { return; }
      let cube = new Cube(this.vertexShader, this.fragmentShader, texture);
      this.set('cube', cube);
      this.startAnimation();
    });
  },

  startAnimation() {
    let cube = this.get('cube');
    this.get('scene').add(cube.mesh);
    this.animate();
  },

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    let cube = this.get('cube');
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    this.updateScale();
    this.draw();
  },

  draw() {
    this.resizeCanvas();
    let glRenderer = this.get('glRenderer');
    let scene = this.get('scene');
    let camera = this.get('camera');
    glRenderer.render(scene, camera);
  },

  updateScale() {
    let cube = this.get('cube');
    let scale = this.get('scale') || 1.0;
    cube.scale(scale);
  },

  scene: Ember.computed(function() {
    return new THREE.Scene();
  }),

  glRenderer: Ember.computed(function() {
    let glRenderer = new THREE.WebGLRenderer({ alpha: true });
    return glRenderer;
  }),

  camera: Ember.computed(function() {
    let element = this.get('element');
    let displayWidth = element.clientWidth;
    let displayHeight = element.clientHeight;

    let camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      displayWidth / displayHeight,
      CAMERA_NEAR_PLANE,
      CAMERA_FAR_PLANE
    );

    camera.position.z = CAMERA_DISTANCE;
    return camera;
  }),

  resizeCanvas() {
    if (!this.get('canvasShouldResize')) { return; }
    let glRenderer = this.get('glRenderer');
    let camera = this.get('camera');
    let element = this.get('element');
    let width = element.clientWidth;
    let height = element.clientHeight;

    glRenderer.setSize(width, height);
    camera.aspect	= width / height;
    camera.updateProjectionMatrix();
  },

  canvasShouldResize: Ember.computed(function() {
    let canvas = this.get('glRenderer').domElement;
    let element = this.get('element');
    let displayWidth  = element.clientWidth;
    let displayHeight = element.clientHeight;
    return displayWidth !== canvas.width || displayHeight !== canvas.height;
  }).volatile()
});
