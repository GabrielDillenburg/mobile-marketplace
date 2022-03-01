import { action, observable, makeObservable } from 'mobx';

import ModalStore from './containers/modalStore';

export default class UIStore {
  modalStore = new ModalStore();

  constructor() {
    makeObservable(this, {
      modalStore: observable,

      /* Actions */
      modal: action.bound,
    });
  }

  modal(props) {
    this.modalStore.show(props);
  }
}
