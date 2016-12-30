import Ember from 'ember';
import THREE from 'npm:three';
import shaders from 'threejs-in-ember/ember-stringify';

export default Ember.Component.extend({
	vertexShader: shaders['vertex.glsl'],
	fragmentShader: shaders['fragment.glsl'],


	didInsertElement() {
		Ember.run.scheduleOnce('afterRender', () => {
			this.configureScene();
		});
	},

	configureScene() {
		this.set('startTime', Date.now());
		this.set('time', 1.0);

		let glRenderer = this.get('glRenderer');

		glRenderer.setSize(window.innerWidth, window.innerHeight);
		this.get('element').appendChild(glRenderer.domElement);

		let loader = new THREE.TextureLoader();
		loader.load('ember-logo.png', (texture) => {
			this.set('texture', texture);
			let cube = this.get('cube');
			this.get('scene').add(cube);
			this.animate();
		});

	},

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		let cube = this.get('cube');
		cube.rotation.x += 0.05;
		cube.rotation.y += 0.05;
		var elapsedMilliseconds = Date.now() - this.get('startTime');
		var elapsedSeconds = elapsedMilliseconds / 1000.;
		this.set('time', 60. * elapsedSeconds);

		this.draw();
	},

	draw() {
		let glRenderer = this.get('glRenderer');
		let scene = this.get('scene');
		let camera = this.get('camera');
		glRenderer.render(scene, camera);
	},

	uniforms: Ember.computed('time', function() {
		return {
			texture: { type: "t", value: this.get('texture') },
			time: { type: "f", value: this.get('time') },
			lights: true
		};
	}),

	scene: Ember.computed(function() {
		return new THREE.Scene();
	}),

	glRenderer: Ember.computed(function() {
		let glRenderer = new THREE.WebGLRenderer();
		glRenderer.setClearColor (0xffff00, 1);
		return glRenderer;
	}),

	camera: Ember.computed(function() {
		let camera = new THREE.PerspectiveCamera(75,
																						 window.innerWidth / window.innerHeight,
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
	})
});
