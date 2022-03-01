/* eslint-disable class-methods-use-this */
import { action, flow, makeObservable, observable } from 'mobx';
import { getEnv } from 'mobx-easy';

import Responsible from '../models/responsible';

export default class ResponsibleStore {
  /**
   * Responsável
   * @type {?import('../models/responsible').default}
   */
  responsible = null;

  constructor() {
    makeObservable(this, {
      /** Observables */
      responsible: observable,

      /** Actions */
      setResponsible: action.bound,
    });
  }

  setResponsible(data) {
    if (data) this.responsible = Responsible.fromApi(data);
    else this.responsible = null;
  }
}
