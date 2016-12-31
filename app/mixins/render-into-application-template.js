import Ember from 'ember';

export default Ember.Mixin.create({
  renderTemplate: function(controller, model) {
    let appController = this.controllerFor('application');
    this.render('application', {
      model: model,
      controller: appController
    });
  }
});
