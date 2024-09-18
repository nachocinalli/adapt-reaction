import Adapt from 'core/js/adapt';
import NavigationButtonModel from 'core/js/models/NavigationButtonModel';
import ReactionNavView from './ReactionNavView';
import navigation from 'core/js/navigation';

class Reaction extends Backbone.Controller {
  initialize() {
    this.listenTo(Adapt, { 'app:dataReady': this.onDataReady });
  }

  static get courseConfig() {
    return Adapt.course.get('_reaction');
  }

  static get globalsConfig() {
    return Adapt.course.get('_globals')?._extensions?._reaction;
  }

  onDataReady() {
    const courseConfig = Reaction.courseConfig;
    if (!courseConfig?._isEnabled) return;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.listenTo(Adapt, {
      remove: this.remove,
      'router:contentObject': this.onContentObject
    });
  }

  onContentObject(pageModel) {
    const contentObjectModel = pageModel.get('_reaction');
    if (contentObjectModel?._isEnabled === false) return;
    if ($('.nav__navigationreaction').length) return;
    const { _navOrder = 100, _showLabel = true, navLabel = '', _navTooltip = {} } = Reaction.globalsConfig ?? {};
    const model = new NavigationButtonModel({
      _id: 'navigationreaction',
      _order: _navOrder,
      _classes: 'btn-icon nav__btn nav__navigationreaction reaction__nav',
      _iconClasses: 'icon-flag',
      _role: 'button',
      _showLabel,
      ariaLabel: navLabel,
      _navTooltip,
      _courseConfig: Reaction.courseConfig
    });

    navigation.addButton(
      new ReactionNavView({
        model
      })
    );
  }

  remove() {
    $('.nav__navigationreaction').remove();
  }
}

export default new Reaction();
