import { action, observable, makeObservable } from 'mobx';

const defaultOptions = Object.freeze({
  type: 'alert',
  visible: false,
  title: 'Informação',
  subtitle: null,
  description: null,
  image: null,
  cancelText: null,
  cancelCallback: () => { },
  confirmText: null,
  confirmCallback: () => { },
  inputCallback: null,
});

export default class ModalStore {
  /**
   * Modal type
   * @type {'alert' | 'input' | 'prompt'}
   * @edefault ['alert']
   */
  type = 'alert';

  /**
   * Sets modal visibility
   * @type {boolean}
   */
  visible = false;

  /**
   * Title: required
   * @type {string}
   */
  title = 'Informação';

  /**
   * Subtitle
   * @type {string}
   */
  subtitle = null;

  /**
   * Subtitle
   * @type {string}
   */
   name = null;

  /**
   * Description
   * @type {string}
   */
  description = null;

  /**
   * Enumerators
   * @type {array}
   */
   enumerators = [];

  /**
   * Image path
   * @type {string}
   */
  image = null;

  /**
   * component path
   * @type {string}
   */
  component = null;

  /**
   * Custom confirm text
   * @type {string}
   */
  confirmText = null;

  /**
   * Custom cancel text
   * @type {string}
   */
  cancelText = null;

  /**
   * Action for confirm button on prompt modals
   * @type {function}
   */
  confirmCallback = () => { };

  /**
   * Custom action for cancel button on prompt modals
   * @type {function}
   */
  cancelCallback = () => { };

  /**
   * Component to retrieve user response
   * @type {object}
   */
  inputCallback = null;

  constructor() {
    makeObservable(this, {
      /* Observables */
      type: observable,
      visible: observable,
      title: observable,
      name: observable,
      subtitle: observable,
      description: observable,
      image: observable,
      component: observable,
      confirmText: observable,
      cancelText: observable,
      confirmCallback: observable,
      inputCallback: observable,
      enumerators: observable,

      /* Actions */
      show: action.bound,
      hide: action.bound,
      set: action.bound,
    });
  }

  set(options = {}) {
    const {
      type,
      visible,
      title,
      name,
      subtitle,
      description,
      image,
      enumerators,
      component,
      confirmText,
      cancelText,
      confirmCallback,
      cancelCallback,
      inputCallback,
    } = {
      ...defaultOptions,
      ...options,
    };

    this.type = type;
    this.visible = visible;
    this.title = title;
    this.name = name;
    this.subtitle = subtitle;
    this.description = description;
    this.image = image;
    this.component = component;
    this.enumerators = enumerators;
    this.confirmCallback = confirmCallback;
    this.cancelCallback = cancelCallback;
    this.inputCallback = inputCallback;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
  }

  show(props) {
    this.set({ ...props, visible: true });
  }

  hide() {
    this.set({ visible: false });
  }
}
