/*exported Cube, Sphere */

import Ember from 'ember';
import RSVP from 'rsvp';
import { task } from 'ember-concurrency';
import THREE from 'npm:three';
import shaders from 'threejs-in-ember/ember-stringify';
import Cube from '../threejs/cube';
import Sphere from '../threejs/sphere';
import Rotator from '../threejs/rotator';

const CAMERA_FOV = 75;
const CAMERA_DISTANCE = 5;
const CAMERA_NEAR_PLANE = 0.1;
const CAMERA_FAR_PLANE = 1000.0;
const ROTATION_DELTA = 0.005;

// TODO: party mode, losing context, improve lighting, loading, don't go to next until shape has loaded

export default Ember.Component.extend({
  webgl: Ember.inject.service(),
  vertexShader: shaders['vertex.glsl'],
  fragmentShader: shaders['fragment.glsl'],

  rotator: Ember.computed(function() {
    return new Rotator(this.get('element'));
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
    let canvas = this.get('webgl').get('renderer').domElement;
    let dimensions = this.get('dimensions');
    return dimensions.width !== canvas.width || dimensions.height !== canvas.height;
  }).volatile(),

  dimensions: Ember.computed(function() {
    let element = this.get('element');
    let displayWidth = element.clientWidth;
    let displayHeight = element.clientHeight;
    return { width: displayWidth, height: displayHeight };
  }).volatile(),

  init() {
    this._super(...arguments);
    this.configureShape();
  },

  didInsertElement() {
    this.addCanvasToElement();
  },

  loadTexturePromise(url) {
    let loader = new THREE.TextureLoader();
    return new RSVP.Promise((resolve) => {
      loader.load(
        url,
        (texture) => { resolve(texture); }
      );
    }).catch(() => {});
  },

  loadTextureTask: task(function * (url) {
    let texture = yield this.loadTexturePromise(url);
    this.set('texture', texture);
  }),

  animateTask: task(function * () {
    /*jshint noyield:true */
    this.rotate(ROTATION_DELTA, ROTATION_DELTA);
    this.draw();
    requestAnimationFrame(() => { this.get('animateTask').perform(); } );
  }),

  addCanvasToElement() {
    let glRenderer = this.get('webgl').get('renderer');
    this.get('element').appendChild(glRenderer.domElement);
  },

  configureShape() {
    let shapeData = this.get('shapeData');
    this.get('loadTextureTask').perform(shapeData.textureUrl)
    .then(() => { this.startAnimation(); })
    .catch(function(e) { console.warn(e); });
  },

  createShape() {
    let Shape = this.get('shapeData').constructor;
    let shape = new Shape(this.vertexShader, this.fragmentShader, this.get('texture'));
    this.set('shape', shape);
  },

  addShapeToScene() {
    this.set('scene', new THREE.Scene());
    this.get('scene').add(this.get('shape').mesh);
  },

  startAnimation() {
    this.createShape();
    this.addShapeToScene();
    this.get('animateTask').perform();
  },

  draw() {
    this.updateScale();
    this.resizeCanvas();
    let glRenderer = this.get('webgl').get('renderer');
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
    this.rotate(x, y);
  },

  rotate(x, y) {
    let shape = this.get('shape');
    shape.rotation.x += y;
    shape.rotation.y += x;
  },

  updateScale() {
    let scale = this.get('scale') || 1.0;
    this.get('shape').scale(scale);
  },

  resizeCanvas() {
    if (!this.get('canvasShouldResize')) { return; }
    let glRenderer = this.get('webgl').get('renderer');
    let camera = this.get('camera');
    let dimensions = this.get('dimensions');

    glRenderer.setSize(dimensions.width, dimensions.height);
    camera.aspect	= dimensions.width / dimensions.height;
    camera.updateProjectionMatrix();
  }
});
