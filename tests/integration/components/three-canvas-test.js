import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('three-canvas', 'Integration | Component | three canvas', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{three-canvas}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#three-canvas}}
      template block text
    {{/three-canvas}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
