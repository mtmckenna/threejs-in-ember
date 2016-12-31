import Ember from 'ember';
import RSVP from 'rsvp';
import { task } from 'ember-concurrency';
import THREE from 'npm:three';
import shaders from 'threejs-in-ember/ember-stringify';
import Cube from '../threejs/cube';
import Rotator from '../threejs/rotator';

const CAMERA_FOV = 75;
const CAMERA_DISTANCE = 5;
const CAMERA_NEAR_PLANE = 0.1;
const CAMERA_FAR_PLANE = 1000.0;
const CUBE_ROTATION_DELTA = 0.005;

// TODO: party mode, ember-concurrency, losing context, improve lighting

export default Ember.Component.extend({
  vertexShader: shaders['vertex.glsl'],
  fragmentShader: shaders['fragment.glsl'],
  classNames: ['three-container'],


  rotator: Ember.computed(function() {
    return new Rotator(this.get('element'));
  }),

  scene: Ember.computed(function() {
    return new THREE.Scene();
  }),

  glRenderer: Ember.computed(function() {
    let glRenderer = new THREE.WebGLRenderer({ alpha: true });
    return glRenderer;
  }),

  camera: Ember.computed(function() {
    let dimensions = this.get('dimensions');

    let camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      dimensions.width / dimensions.height,
      CAMERA_NEAR_PLANE,
      CAMERA_FAR_PLANE
    );

    camera.position.z = CAMERA_DISTANCE;
    return camera;
  }),

  canvasShouldResize: Ember.computed(function() {
    let canvas = this.get('glRenderer').domElement;
    let dimensions = this.get('dimensions');
    return dimensions.width !== canvas.width || dimensions.height !== canvas.height;
  }).volatile(),

  dimensions: Ember.computed(function() {
    let element = this.get('element');
    let displayWidth = element.clientWidth;
    let displayHeight = element.clientHeight;
    return { width: displayWidth, height: displayHeight };
  }).volatile(),

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', () => {
      this.configureScene();
    });
  },

  loadTexturePromise(url) {
    let loader = new THREE.TextureLoader();
    return new RSVP.Promise((resolve) => {
      loader.load(url, (texture) => { resolve(texture); });
    });
  },

  loadTexture: task(function * () {
    let texture = yield this.loadTexturePromise('ember-logo.png');
    this.set('texture', texture);
  }),

  configureScene() {
    let glRenderer = this.get('glRenderer');
    this.get('element').appendChild(glRenderer.domElement);
    this.get('loadTexture').perform().then(() => { this.startAnimation(); });
  },

  startAnimation() {
    let cube = new Cube(this.vertexShader, this.fragmentShader, this.get('texture'));
    this.set('cube', cube);
    this.get('scene').add(cube.mesh);
    this.animate();
  },

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.rotateCube(CUBE_ROTATION_DELTA, CUBE_ROTATION_DELTA);
    this.draw();
  },

  draw() {
    this.updateScale();
    this.resizeCanvas();
    let glRenderer = this.get('glRenderer');
    glRenderer.render(this.get('scene'), this.get('camera'));
  },

  touchMove(event) {
    this.mouseMove(event);
  },

  touchEnd() {
    this.mouseUp();
  },

  mouseMove(event) {
    this.handleUserRotation(event);
    event.preventDefault();
  },

  mouseUp() {
    this.get('rotator').userStoppedRotating();
  },

  handleUserRotation(event) {
    let rotator = this.get('rotator');
    if (!rotator.shouldRotate(event)) { return; }
    let { x, y } = rotator.rotationDeltas(event);
    this.rotateCube(x, y);
  },

  rotateCube(x, y) {
    let cube = this.get('cube');
    cube.rotation.x += y;
    cube.rotation.y += x;
  },

  updateScale() {
    let scale = this.get('scale') || 1.0;
    this.get('cube').scale(scale);
  },

  resizeCanvas() {
    if (!this.get('canvasShouldResize')) { return; }
    let glRenderer = this.get('glRenderer');
    let camera = this.get('camera');
    let dimensions = this.get('dimensions');

    glRenderer.setSize(dimensions.width, dimensions.height);
    camera.aspect	= dimensions.width / dimensions.height;
    camera.updateProjectionMatrix();
  }
});
