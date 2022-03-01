import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { timeoutPromise } from '../utils/timeoutPromise';
import { SYSTEM_INSTABILITY } from '../constants/Messages';

export default class ClassDataApiService {
  /**
   * Base url da API
   * @type {string}
   */
  baseUrl = null;

  /**
   * Rating url da API
   * @type {string}
   */
  ratingUrl = null;

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
   * @memberof ClassDataApiService
   * @since 1.0.0
   */
  constructor(baseUrl, ratingUrl, { token = null } = {}) {
    this.baseUrl = baseUrl || '';
    this.ratingUrl = ratingUrl || '';
    this.token = token;
  }

  /**
   * Busca dados de aula
   * @param {string} title
   * @param {string} description
   * @param {string} picture
   * @param {string} ageGroup
   * @param {string} location
   * @param {Teacher} teacher
   * @param {Student} student
   * @returns {classData} uma nova instancia de dados de aula
   *
   * @memberof ApiService
   * @since 1.0.0
   */

  /**
   *
   * @param {number} classOccurrenceId Defined by context (e.g. class card).
   * @param {object} payload with boolean @property status and @property absent_reason.
   * @returns server response status.
   */
  async checkinOrAbsence(classOccurrenceId, payload = {}) {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(
          `${this.baseUrl}/class-occurrence/checkin-or-absence/${classOccurrenceId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        ),
      );

      // console.log('checkinOrAbsence URL', response.url);
      // console.log('checkinOrAbsence STATUS', response.status);
      // const json = await response.json();
      // console.log('checkinOrAbsence RESPONSE', json);

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
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }

  /**
   *
   * @param {boolean} assign Used to decide correct endpoint.
   * @param {number} classTimeId
   * @param {object} payload with single @property cancel_reason.
   * @returns server response status.
   */
  async studentAssignment(assign, classTimeId, payload = {}) {
    const endpoint = assign ? 'assign-student' : 'unassign-student';

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/class-times/${endpoint}/${classTimeId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }),
      );

      // console.log('studentAssignment BODY', payload);
      // console.log('studentAssignment URL', response.url);
      // console.log('studentAssignment STATUS', response.status);
      // const json = await response.json();
      // console.log('studentAssignment RESPONSE', json);

      if (response.status === 400) {
        Toast.show({
          type: 'failure',
          text1: 'A idade do aluno é incompatível com a faixa etária da aula.',
        });
        return null;
      }

      if (response.status === 409) {
        Toast.show({
          type: 'failure',
          text1: 'Aluno já está inscrito nesta aula.',
        });
        return null;
      }

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
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }

  /**
   * Interim send mail hook
   */
  async sendMail(classId) {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/classes/${classId}/send-email`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      );

      // console.log('sendMail URL', response.url);
      // console.log('sendMail STATUS', response.status);
      // const json = await response.json();
      // console.log('sendMail RESPONSE', json);

      if (response.status !== 202) {
        Toast.show({
          type: 'failure',
          text1: SYSTEM_INSTABILITY,
        });

        return null;
      }

      const json = await response.json();
      return json;
    } catch (error) {
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }

  /**
   * Common function for any endpoint serving classes list required by @ref ../stores/containers/classDataStore.
   */
  async fetchList(list, page = 1, data = {}) {
    const token = await AsyncStorage.getItem('token');

    const endpoints = {
      classes: 'classes/school',
      filtered: 'classes/filter',
      occurrences: 'students/occurrences-list',
    };
    const endpoint = endpoints[list];

    const encodeData = () => {
      const params = [];
      Object.entries(data).map((item) => {
        if (Array.isArray(item[1]))
          item[1].map((val) =>
            params.push(
              `${encodeURIComponent(`${item[0]}[]`)}=${encodeURIComponent(
                val,
              )}`,
            ),
          );
        else
          params.push(
            `${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`,
          );
        return true;
      });
      return `&${params.join('&')}`;
    };
    const getString = Object.entries(data).length > 0 ? encodeData() : '';

    try {
      const response = await timeoutPromise(
        fetch(`${this.baseUrl}/${endpoint}?page=${page}${getString}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      // console.log('fetchList URL', response.url);
      // console.log('fetchList STATUS', response.status);
      // console.log('fetchList META', response.meta);
      // const json = await response.json();
      // console.log('fetchList RESPONSE', json);

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
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });

      return null;
    }
  }

  /**
   *
   * @param {number} teacherId Defined by context (e.g. class card).
   * @returns server response status.
   */
  async getRatingAvg(teacherId) {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(
          `${this.ratingUrl}/rating/average-rating/${teacherId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
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
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }

  /**
   *
   * @param {number} teacherId Defined by context (e.g. class card).
   * @returns server response status.
   */
  async getRating(teacherId) {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(
          `${this.ratingUrl}/rating/${teacherId}?page=1&limit=10`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
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
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }

  async saveRatingAvg(payload) {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await timeoutPromise(
        fetch(
          `${this.ratingUrl}/rating/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
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
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
      return null;
    }
  }
}
