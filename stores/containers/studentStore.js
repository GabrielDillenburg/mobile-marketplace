/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { action, computed, flow, makeObservable, observable } from 'mobx';
import { getEnv } from 'mobx-easy';
import Toast from 'react-native-toast-message';

import getRootStore from '../../utils/getRootStore';

import Student from '../models/student';

export default class StudentStore {
  /**
   * Responsável
   * @type {?import('../models/student').default}
   */
  student = null;

  studentRegisterData = null;

  /**
   * Estado atual da requisição de perfil usuário ao backend
   * @type {'pending' | 'fetched' | 'error'}
   */
  getStudentProfileStatus = 'pending';

  /**
   * Estado atual da requisição de deleção de conta ao backend
   * @type {'idle' | 'pending' | 'deleted' | 'error'}
   */
  deleteAccountStatus = 'idle';

  constructor() {
    makeObservable(this, {
      /** Observables */
      student: observable,
      studentRegisterData: observable,
      getStudentProfileStatus: observable,
      deleteAccountStatus: observable,

      /** Computed */
      isFetchingStudentProfile: computed,
      isDeletingAccount: computed,

      /** Actions */
      setStudent: action.bound,
      setStudentRegisterData: action.bound,
      register: flow,
      saveResponsible: flow,
      getStudentProfile: flow,
      deleteAccount: flow,
      webapp: flow,
    });
  }

  /**
   * Booleano que representa se uma ação de requisição de dados do perfil do estudante está sendo realizada
   * @returns {boolean} true se uma tentativa de requisição de dados do perfil do estudante está em andamento
   */
  get isFetchingStudentProfile() {
    return this.getStudentProfileStatus === 'pending';
  }

  /**
   * Booleano que representa se uma ação de deleção de conta está sendo realizada
   * @returns {boolean} true se uma tentativa de deleção de conta está em andamento
   */
  get isDeletingAccount() {
    return this.deleteAccountStatus === 'pending';
  }

  *register(editing = false) {
    /** @type {import('../createRootStore').Env} */
    const env = getEnv();

    const res = yield env.studentApi.register(
      this.studentRegisterData,
      editing,
      this?.student?.id,
    );

    if (res) {
      if (editing) this.setStudent(res.data);

      return true;
    }

    return false;
  }

  *saveResponsible(editing) {
    /** @type {import('../createRootStore').Env} */
    const env = getEnv();

    const res = yield env.studentApi.saveResponsible(
      this.studentRegisterData.responsible,
      editing,
      this?.student?.id,
    );

    if (res) return true;

    return false;
  }

  *getStudentProfile() {
    this.getStudentProfileStatus = 'pending';

    /** @type {import('../createRootStore').Env} */
    const env = getEnv();

    const res = yield env.api.getUserData();

    if (res?.profiles?.length) {
      const profile = res.profiles.find((item) => item.role === 'student');

      if (profile) {
        this.setStudent(profile);
        this.getStudentProfileStatus = 'fetched';

        if (profile?.parents?.length) {
          const responsible = profile.parents[0];
          getRootStore().responsibleStore.setResponsible(responsible);
        }

        return true;
      }

      Toast.show({
        type: 'failure',
        text1:
          'Seu perfil de usuário não está cadastrado com esse tipo de conta. Tente o app para professores ou verifique seu usuário e senha.',
      });

      this.getStudentProfileStatus = 'error';
      return false;
    }

    this.getStudentProfileStatus = 'error';
    return false;
  }

  *deleteAccount() {
    this.deleteAccountStatus = 'pending';

    /** @type {import('../createRootStore').Env} */
    const env = getEnv();

    const res = yield env.studentApi.deleteAccount();

    if (res) {
      this.deleteAccountStatus = 'deleted';
      return true;
    }

    this.deleteAccountStatus = 'error';
    return false;
  }

  setStudent(student) {
    if (student) this.student = Student.fromApi(student);
    else this.student = null;
  }

  setStudentRegisterData(data) {
    if (data) this.studentRegisterData = data;
    else this.studentRegisterData = null;
  }

  *webapp() {
    /** @type {import('../createRootStore').Env} */
    const env = getEnv();
    yield env.studentApi.webapp(this.student.id)
  }
}
