import Ember from 'ember';

const SHAPES = ['cube', 'sphere'];

export default Ember.Controller.extend({
  queryParams: ['scale'],

  nextShapeName(currentShapeName) {
    return SHAPES[(SHAPES.indexOf(currentShapeName) + 1) % SHAPES.length];
  },

  actions: {
    updateScale(event) {
      this.set('scale', event.target.value);
    },

    nextShape() {
      let currentShapeName = this.get('model').shapeName;
      let nextShapeName = this.nextShapeName(currentShapeName);
      this.transitionToRoute(nextShapeName);
    }
  }
});
