import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { timeoutPromise } from '../utils/timeoutPromise';

export default class ApiService {
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
   * @memberof ApiService
   * @since 1.0.0
   */
  constructor(baseUrl, { token = null } = {}) {
    this.baseUrl = baseUrl || '';
    this.token = token;
  }

  /**
   * Chamada api para authenticar usuário na API
   * @param {string} username
   * @param {string} password
   * @returns {boolean} true|false de acordo com o sucesso da chamada
   *
   * @memberof ApiService
   * @since 1.0.0
   */
  async authenticate(username, password) {
    try {
      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: username, password }),
        }),
      );

      // console.log('authenticate URL', response.url);
      // console.log('authenticate STATUS', response.status);
      // const json = await response.json();
      // console.log('authenticate RESPONSE', json);

      if (response?.status !== 200) {
        return null;
      }

      const json = await response.json();

      const { token } = json.data;

      this.token = token;

      await AsyncStorage.setItem('token', token);

      return true;
    } catch (error) {
      console.log('authenticate error: ', error.message);

      return null;
    }
  }

  async socialLogin(googleToken) {
    try {
      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/auth/google`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: googleToken, role: 'student' }),
        }),
      );

      // console.log('socialLogin STATUS', response.status);
      // console.log('socialLogin URL', response.url);
      // const json = await response.json();
      // console.log('socialLogin JSON', json);

      if (response?.status === 404) {
        await SecureStore.deleteItemAsync('edtechProfessorGoogleData');
        return {
          error: 404,
        };
      }

      if (response?.status !== 200) {
        await SecureStore.deleteItemAsync('edtechProfessorGoogleData');
        return null;
      }

      const json = await response.json();

      const { token } = json.data;

      this.token = token;

      await AsyncStorage.setItem('token', token);

      return true;
    } catch (error) {
      await SecureStore.deleteItemAsync('edtechProfessorGoogleData');
      console.log('socialLogin error: ', error.message);

      return null;
    }
  }

  /**
   * Chamada api para buscar os dados do usuário logado
   * @returns {object} objeto com os dados do usuário
   *
   * @memberof ApiService
   * @since 1.0.0
   */
  async getUserData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/me`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      // console.log('getUserData URL', response.url);
      // console.log('getUserData STATUS', response.status);
      // const json = await response.json();
      // console.log('getUserData RESPONSE', json);

      if (response.status !== 200) {
        return null;
      }

      const json = await response.json();

      return json.data;
    } catch (error) {
      console.log('api getUserData error: ', error.message);

      return false;
    }
  }
}
