import Ember from 'ember';
import Sphere from '../threejs/sphere';
import RenderIntoApplicationTemplate from '../mixins/render-into-application-template';

export default Ember.Route.extend(RenderIntoApplicationTemplate, {
  model() {
    return {
      // http://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73580/world.topo.bathy.200401.3x5400x2700.jpg
      textureUrl: '/earth.png',
      shapeName: 'sphere',
      constructor: Sphere
    };
  }
});
