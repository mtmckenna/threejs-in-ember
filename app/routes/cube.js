import Ember from 'ember';
import Cube from '../threejs/cube';
import RenderIntoApplicationTemplate from '../mixins/render-into-application-template';

export default Ember.Route.extend(RenderIntoApplicationTemplate, {
  model() {
    return {
      // http://emberjs.com/logos/
      textureUrl: '/ember-logo.png',
      shapeName: 'cube',
      constructor: Cube
    };
  }
});
