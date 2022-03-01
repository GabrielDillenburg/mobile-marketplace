/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { timeoutPromise } from '../utils/timeoutPromise';

import { FINANCIAL_REQUIRED, SYSTEM_INSTABILITY } from '../constants/Messages';
import openUrl from '../utils/openUrl';

export default class StudentApiService {
  /**
   * Base url da API
   * @type {string}
   */
  baseUrl = null;

  /**
   * Financial url da API
   * @type {string}
   */
  financialbaseUrl = null;
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
   * @memberof StudentApiService
   * @since 1.0.0
   */
  constructor(baseUrl, financialbaseUrl, { token = null } = {}) {
    this.baseUrl = baseUrl || '';
    this.financialbaseUrl = financialbaseUrl || '';
    this.token = token;
  }

  async register(payload, editing = false, profileId = null) {
    try {
      const token = await AsyncStorage.getItem('token');

      // eslint-disable-next-line no-undef
      const body = new FormData();

      Object.keys(payload).forEach((key) => {
        if (key === 'responsible') return;

        if (key === 'email' && editing) return;

        if (key === 'image') {
          const EXT_REGEX = /\.([^\\.]+$)/;
          const match = payload[key].match(EXT_REGEX);

          if (match) {
            const ext = match[1];

            body.append('image', {
              name: `image.${ext}`,
              type: `image/${ext}`,
              uri:
                Platform.OS === 'android'
                  ? payload[key]
                  : payload[key].replace(/file:\/\//i, ''),
            });
          }

          return;
        }

        if (payload[key] != null) {
          body.append(key, payload[key]);
        }
      });

      if (editing && profileId) body.append('_method', 'PUT');

      const response = await timeoutPromise(
        fetch(
          editing && profileId
            ? `${this.baseUrl}/user-profile/${profileId}`
            : `${this.baseUrl}/v2/auth/register`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            body,
          },
        ),
      );
      // console.log('register body', body);
      // console.log('register URL', response.url);
      // console.log('register STATUS', response.status);
      // const json = await response.json();
      // console.log('register RESPONSE', json);

      if (response.status === 422) {
        Toast.show({
          type: 'failure',
          text1: 'Este e-mail já está em uso.',
        });

        return null;
      }

      if (
        (editing && response.status !== 200) ||
        (!editing && response.status !== 201)
      ) {
        Toast.show({
          type: 'failure',
          text1: SYSTEM_INSTABILITY,
        });

        return null;
      }

      const json = await response.json();

      return json;
    } catch (error) {
      console.log('studentApi register error');
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }

  async saveResponsible(payload, editing = false, profileId = null) {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(
          editing && profileId
            ? `${this.baseUrl}/parent/${profileId}`
            : `${this.baseUrl}/parent`,
          {
            method: editing && profileId ? 'PUT' : 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        ),
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
      console.log('studentApi saveResponsible error');
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }

  async deleteAccount() {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/unregister`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      if (response.status !== 200) {
        Toast.show({
          type: 'failure',
          text1: SYSTEM_INSTABILITY,
        });
        return null;
      }

      const json = await response.json();

      return json;
    } catch (error) {
      console.log('studentApi deleteAccount error');
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });

      return null;
    }
  }

  async verifyAccount(profileId, teacherId = null, estimatedValue = null) {
    try {
      const token = await AsyncStorage.getItem('token');

      console.log(
        `${this.financialbaseUrl}/customer/${profileId}/verify?teacher_id=${teacherId}`,
        token,
      );
      const response = await timeoutPromise(
        fetch(
          `${this.financialbaseUrl}/customer/${profileId}/verify?teacher_id=${teacherId}&value=${estimatedValue}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      console.log(response.status);

      if (response.status === 404) {
        console.log(`status`, response.status);
        Toast.show({
          type: 'failure',
          text1: FINANCIAL_REQUIRED,
        });
        const json = await response.json();
        console.log(`body`, json);

        return json;
      }

      if (response.status !== 200) {
        Toast.show({
          type: 'failure',
          text1: FINANCIAL_REQUIRED,
        });
        return null;
      }

      const json = await response.json();

      return json;
    } catch (error) {
      console.log('studentApi verifyAccount error');
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });

      return null;
    }
  }

  async cancelOccurence(profileId, teacherId, privateClassId) {
    try {
      const token = await AsyncStorage.getItem('token');

      console.log(
        `${this.financialbaseUrl}/customer/${profileId}/cancel?teacher_id=${teacherId}`,
      );
      const response = await timeoutPromise(
        fetch(
          `${this.financialbaseUrl}/customer/${profileId}/cancel?teacher_id=${teacherId}&class=${privateClassId}`,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      if (response.status !== 200) {
        Toast.show({
          type: 'failure',
          text1: FINANCIAL_REQUIRED,
        });
        return null;
      }

      const json = await response.json();

      return json;
    } catch (error) {
      console.log('studentApi verifyAccount error');
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });

      return null;
    }
  }

  async webapp(profileId) {
    try {
      const token = await AsyncStorage.getItem('token');
      openUrl(
        `https://financeiro.edtech.com.br/#/student?user=${profileId}&to=${token}`,
      );
    } catch (error) {
      console.log('studentApi webapp error');
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });

      return null;
    }
  }
}
