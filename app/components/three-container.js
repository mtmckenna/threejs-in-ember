import Ember from 'ember';
import THREE from 'npm:three';
import shaders from 'threejs-in-ember/ember-stringify';

// TODO: texture loader, party mode, dragging, netlify, getters, ember-concurrency, wrap three.js in its own class

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
      this.set('texture', texture);
      let cube = this.get('cube');
      this.get('scene').add(cube);
      this.animate();
    });

  },

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

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    let cube = this.get('cube');
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    this.updateScale();
    this.draw();
  },

  updateScale() {
    let cube = this.get('cube');
    let scale = this.get('scale') || 1.0;
    cube.scale.set(scale, scale, scale);
  },

  draw() {
    this.resizeCanvas();
    let glRenderer = this.get('glRenderer');
    let scene = this.get('scene');
    let camera = this.get('camera');
    glRenderer.render(scene, camera);
  },

  uniforms: Ember.computed(function() {
    return {
      texture: { type: "t", value: this.get('texture') }
    };
  }),

  scene: Ember.computed(function() {
    return new THREE.Scene();
  }),

  glRenderer: Ember.computed(function() {
    let glRenderer = new THREE.WebGLRenderer({ alpha: true });
    return glRenderer;
  }),

  camera: Ember.computed(function() {
    let element = this.get('element');
    let displayWidth  = element.clientWidth;
    let displayHeight = element.clientHeight;

    let camera = new THREE.PerspectiveCamera(75,
                                             displayWidth / displayHeight,
                                             0.1,
                                             1000.0);
                                             camera.position.z = 5;
                                             return camera;
  }),

  geometry: Ember.computed(function() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    return geometry;
  }),

  material: Ember.computed(function() {
    let vertexShader = this.get('vertexShader');
    let fragmentShader = this.get('fragmentShader');
    let uniforms = this.get('uniforms');

    return new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms
    });
  }),

  cube: Ember.computed(function() {
    let geometry = this.get('geometry');
    let material = this.get('material');
    let cube = new THREE.Mesh(geometry, material);
    return cube;
  }),

  canvasShouldResize: Ember.computed(function() {
    let canvas = this.get('glRenderer').domElement;
    let element = this.get('element');
    let displayWidth  = element.clientWidth;
    let displayHeight = element.clientHeight;
    return displayWidth !== canvas.width || displayHeight !== canvas.height;
  }).volatile()
});
