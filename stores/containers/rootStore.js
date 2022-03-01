import AuthStore from './authStore';
import UIStore from './uiStore/uiStore';
import StudentStore from './studentStore';
import ResponsibleStore from './responsibleStore';
import ClassDataStore from './classDataStore';

export default class RootStore {
  /** @type {import('./authStore').default} */
  authStore = null;

  /** @type {import('./uiStore/uiStore').default} */
  uiStore = null;

  /** @type {import('./studentStore/studentStore').default} */
  studentStore = null;

  /** @type {import('./responsible').default} */
  reponsibleStore = null;

  /** @type {import('./classDataStore').default} */
  classDataStore = null;

  init() {
    this.authStore = new AuthStore();
    this.uiStore = new UIStore();
    this.studentStore = new StudentStore();
    this.responsibleStore = new ResponsibleStore();
    this.classDataStore = new ClassDataStore();
  }
}
