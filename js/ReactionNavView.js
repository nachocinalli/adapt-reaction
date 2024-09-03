import Adapt from 'core/js/adapt';
import tooltips from 'core/js/tooltips';
import NavigationButtonView from 'core/js/views/NavigationButtonView';
import ReactionFormView from './ReactionFormView';
import notify from 'core/js/notify';

export default class ReactionNavView extends NavigationButtonView {
  events() {
    return {
      click: 'onReactionClicked'
    };
  }

  attributes() {
    return {
      ...super.attributes(),
      'data-tooltip-id': this.model.get('_id')
    };
  }

  initialize(options) {
    super.initialize(options);
    this.setupEventListeners();
    this.render();

    tooltips.register({
      _id: this.model.get('_id'),
      ...(this.model.get('_navTooltip') || {})
    });
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setupEventListeners() {
    this.listenTo(Adapt, {
      remove: this.remove
    });
  }

  onReactionClicked(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (this._isPopupOpen) return;

    this._isPopupOpen = true;
    this.popupView = new ReactionFormView({
      model: this.model.get('_courseConfig')
    });
    notify.popup({
      _attributes: { 'data-adapt-id': 'reaction' },
      _view: this.popupView,
      _isCancellable: true,
      _showCloseButton: true,
      _classes: 'reaction'
    });

    this.listenToOnce(Adapt, {
      'popup:closed': this.onPopupClosed
    });
  }

  onPopupClosed() {
    this._isPopupOpen = false;
  }

  static get template() {
    return 'reactionNav.jsx';
  }
}
