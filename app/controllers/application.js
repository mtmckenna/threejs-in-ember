import Ember from 'ember';

const SHAPES = ['cube', 'sphere'];

export default Ember.Controller.extend({
  queryParams: ['scale', 'partyMode'],

  isPartyMode: Ember.computed('partyMode', function() {
    return !!parseInt(this.get('partyMode'));
  }),

  nextShapeName(currentShapeName) {
    return SHAPES[(SHAPES.indexOf(currentShapeName) + 1) % SHAPES.length];
  },

  actions: {
    updateScale(event) {
      this.set('scale', event.target.value);
    },

    updatePartyMode(event) {
      let partyMode = event ? 1 : 0;
      this.set('partyMode', partyMode);
    },

    nextShape() {
      let currentShapeName = this.get('model').shapeName;
      let nextShapeName = this.nextShapeName(currentShapeName);
      this.transitionToRoute(nextShapeName);
    }
  }
});
