import { action, computed, flow, makeObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEnv } from 'mobx-easy';
import getRoot from '../../utils/getRootStore';

import User from '../models/user';

export default class AuthStore {
  /**
   * Usuário autenticado
   * @type {?import('../models/user').default}
   */
  user = null;

  sectionExpired = false;

  /**
   * Estado atual do usuário perante ao sistema de autenticação
   * @type {'pending' | 'authenticated' | 'unauthenticated'}
   */
  status = 'unauthenticated';

  constructor() {
    makeObservable(this, {
      /* Dados observáveis */
      user: observable,
      status: observable,
      sectionExpired: observable,

      /**
       * Dados memoificados são dados calculados e salvos em memória.
       * Recomputam apenas quando suas dependências mudam
       */
      isAuthenticated: computed,
      isFetching: computed,

      /**
       * Funções síncronas. Único mistério
       * declarar como action.bound por causa de problemas com JS e THIS
       */
      setUser: action.bound,
      unauthenticate: action.bound,
      setSectionExpired: action.bound,

      /**
       * Funções assíncronas devem ser declaradas como flow e
       * devem ser funções geradoras (com * antes do nome)
       */
      authenticate: flow,
      socialLogin: flow,
    });
  }

  /**
   * Booleano que representa se existe um usuário
   * autenticado no sistema
   * @returns {boolean} true se existe um usuário validado
   */
  get isAuthenticated() {
    /** Mobx se encarrega de recomputar apenas quando status tem seu valor alterado */
    return this.status === 'authenticated';
  }

  /**
   * Booleano que representa se uma ação de autenticação está sendo realizada
   * @returns {boolean} true se uma tentativa de autenticação está em andamento
   */
  get isFetching() {
    return this.status === 'pending';
  }

  *authenticate(username, password) {
    this.status = 'pending';

    /** @type {import('../createRootStore').Env} */
    const env = getEnv();

    const res = yield env.api.authenticate(username, password);

    if (res) {
      const profileDataRes = yield getRoot().studentStore.getStudentProfile();

      if (profileDataRes) {
        this.status = 'authenticated';
        return true;
      }

      this.unauthenticate();
      return false;
    }

    this.unauthenticate();
    return false;
  }

  *socialLogin(googleToken) {
    this.status = 'pending';

    /** @type {import('../createRootStore').Env} */
    const env = getEnv();

    const res = yield env.api.socialLogin(googleToken);

    if (res) {
      const { error } = res;

      if (error === 404) {
        this.unauthenticate();
        return res;
      }

      const profileDataRes = yield getRoot().studentStore.getStudentProfile();

      if (profileDataRes) {
        this.status = 'authenticated';
        return true;
      }

      this.unauthenticate();
      return false;
    }

    this.unauthenticate();
    return false;
  }

  setUser(user) {
    if (user instanceof User) {
      this.user = user;
    }
  }

  unauthenticate() {
    AsyncStorage.removeItem('token');
    this.status = 'unauthenticated';
    this.user = null;
    getRoot().classDataStore.setClassesList();
    getRoot().studentStore.setStudent();
    getRoot().studentStore.setStudentRegisterData();
  }

  setSectionExpired(value) {
    this.sectionExpired = value;
  }
}
