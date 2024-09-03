import Adapt from 'core/js/adapt';
import { templates } from 'core/js/reactHelpers';
import React from 'react';
import ReactDOM from 'react-dom';
export default class ReactionFormView extends Backbone.View {
  className() {
    return 'reaction__form';
  }

  initialize() {
    this.listenTo(Adapt, 'remove', this.remove);
    this.render();
  }

  render() {
    ReactDOM.render(<templates.reactionForm {...this.model} />, this.el);
  }
}
