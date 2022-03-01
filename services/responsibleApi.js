import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { timeoutPromise } from '../utils/timeoutPromise';

import { SYSTEM_INSTABILITY } from '../constants/Messages';

export default class ResponsibleApiService {
  /**
   * Base url da API
   * @type {string}
   */
  baseUrl = null;

  /**
   * Token para chamadas authenticadas
   * @type {string}
   */
  token = null;

  /**
   * Cria serviço de API
   *
   * @param {string} baseUrl
   * @param {Object} [options]
   * @param {string} [options.token]
   *
   * @memberof ResponsibleApiService
   * @since 1.0.0
   */
  constructor(baseUrl, { token = null } = {}) {
    this.baseUrl = baseUrl || '';
    this.token = token;
  }

  async saveResponsible(payload) {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/parent`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }),
      );

      if (response.status !== 201) {
        Toast.show({
          type: 'failure',
          text1: SYSTEM_INSTABILITY,
        });

        return null;
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.log('responsibleApi saveResponsible error');
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }
}
