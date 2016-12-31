import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Cube from '../../../threejs/cube';

moduleForComponent('three-container', 'Integration | Component | three container', {
  integration: true
});

test('it renders', function(assert) {
  this.set('model', {
    textureUrl: '/ember-logo.png',
    shapeName: 'cube',
    constructor: Cube
  });
  this.render(hbs`{{three-container shapeData=model}}`);

  assert.equal(this.$().text().trim(), '');
});
