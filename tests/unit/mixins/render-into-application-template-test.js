import Ember from 'ember';
import RenderIntoApplicationTemplateMixin from 'threejs-in-ember/mixins/render-into-application-template';
import { module, test } from 'qunit';

module('Unit | Mixin | render into application template');

// Replace this with your real tests.
test('it works', function(assert) {
  let RenderIntoApplicationTemplateObject = Ember.Object.extend(RenderIntoApplicationTemplateMixin);
  let subject = RenderIntoApplicationTemplateObject.create();
  assert.ok(subject);
});
