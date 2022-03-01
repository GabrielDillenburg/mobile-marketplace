import { wrapRoot } from 'mobx-easy';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ApiService from '../services/api';
import StudentApiService from '../services/studentApi';
import ResponsibleApiService from '../services/responsibleApi';
import ClassDataApiService from '../services/classDataApi';
import RootStore from './containers/rootStore';

export default async function createRootStore() {
  const baseUrl = 'https://api.edtech.com.br/api';
  const financialbaseUrl = 'https://devapifinanceiro.edtech.com.br/v1';
  const ratingbaseUrl =
    'http://apiedtech-develop.eba-r3kxgyyu.us-east-2.elasticbeanstalk.com/v1';

  const token = await AsyncStorage.getItem('token');

  /** TODO: Adicionar carregamento do token do local storage */
  /* Env contem os serviços que podem ser chamados dentro das stores */
  const env = {
    api: new ApiService(baseUrl, { token }),
    studentApi: new StudentApiService(baseUrl, financialbaseUrl, { token }),
    responsibleApi: new ResponsibleApiService(baseUrl, {
      token,
    }),
    classDataApi: new ClassDataApiService(baseUrl, ratingbaseUrl, { token }),
  };

  return wrapRoot({ RootStore, env });
}

/**
 * @typedef Env
 * @property {import('../services/api').default} api
 * @property {import('../services/studentApi').default} studentApi
 * @property {import('../services/responsibleApi').default} responsibleApi
 * @property {import('../services/classDataApi').default} classDataApi
 *
 */

/* Esta linha força com que typedef seja exportado */
export {};
