/* eslint-disable no-unused-expressions */
import { action, computed, flow, makeObservable, observable } from 'mobx';
import { getEnv } from 'mobx-easy';

import ClassData from '../models/classData';
import { keys2Camel } from '../../utils/formatString';

export default class ClassDataStore {
  /**
   * All classes
   * @type {?import('../models/classData').default}
   */
  classesList = [];

  classesOccurrences = [];

  filteredClasses = [];

  filterTitle = '';

  filterIsOnline = null;

  filterAgeGroup = [];

  /** @type {'opening' | 'idle' | 'fetching' | 'refreshing' | 'completed' | 'error'} */
  exploreStatus = 'idle';

  /** @type {'opening' | 'idle' | 'fetching' | 'refreshing' | 'completed' | 'error'} */
  occurrencesStatus = 'idle';

  errorMessage = '';

  rating = 0;

  ratingScore = { ratingAvg: 0, count: 0 };

  ratingsList = [];

  constructor() {
    makeObservable(this, {
      /** Observables */
      classesList: observable,
      classesOccurrences: observable,
      filteredClasses: observable,
      exploreStatus: observable,
      occurrencesStatus: observable,
      errorMessage: observable,
      filterTitle: observable,
      filterIsOnline: observable,
      filterAgeGroup: observable,
      rating: observable,
      ratingScore: observable,
      ratingsList: observable,
      /** Computed */
      exploreIsComplete: computed,
      ocurrencesIsComplete: computed,

      /** Actions */
      setClassesList: action.bound,
      setClassesOccurrences: action.bound,
      setFilterTitle: action.bound,
      setTeacherRating: action.bound,
      setTeacherRatingScore: action.bound,
      setTeacherRatings: action.bound,

      setFilterIsOnline: action.bound,
      cleanFilter: action.bound,
      setFilterAgeGroup: action.bound,

      /** Async Actions */
      fetchList: flow,
      fetchClasses: flow,
      verifyStudent: flow,
      fetchRating: flow,
      fetchOccurrences: flow,
      saveRating: flow,
    });

    this.filterTitle = '';

    this.filterIsOnline = null;

    this.filterAgeGroup = [];
  }

  get exploreIsComplete() {
    return this.exploreStatus === 'completed';
  }

  get ocurrencesIsComplete() {
    return this.occurrencesStatus === 'completed';
  }

  setFilterTitle(value) {
    this.filterTitle = value;
  }

  setTeacherRating(value) {
    this.rating = value;
  }

  setTeacherRatingScore(value) {
    this.ratingScore = value;
  }

  setTeacherRatings(list) {
    this.ratingsList = list;
  }

  setFilterIsOnline(value) {
    this.filterIsOnline = value;
  }

  setFilterAgeGroup(list) {
    this.filterAgeGroup = list;
  }

  *fetchList(list, page = 1, data = {}) {
    if (list === 'occurrences') {
      this.occurrencesStatus = 'fetching';
    } else {
      this.exploreStatus = 'fetching';
    }

    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();
      const res = yield env.classDataApi.fetchList(list, page, data);

      if (list === 'occurrences') {
        if (page > 1) {
          this.classesOccurrences = [
            ...this.classesOccurrences,
            ...res.data.map((item) =>
              item?.classTimetable ?
                ClassData.fromAPI({
                  ...keys2Camel(item?.classTimetable?.class || {}),
                  ...keys2Camel(item || {}),
                  ...keys2Camel(item.classTimetable || {}),
                  classTime: item?.classTimetable?.time,
                  classTimeId: item?.classTimetable?.id,
                  classOccurrenceId: item.id,
                  occurrenceStatus: item.status,
                  attendanceStatus: item.attendance_status.status,
                  privateClassId: item.private_class_id,
                }) : null,
            ).filter(e => e !== null),
          ];
        } else {
          this.setClassesOccurrences(res.data);
        }
      }

      if (list !== 'occurrences') {
        if (page > 1) {
          this.classesList = [
            ...this.classesList,
            ...res.data.map((item) =>
              ClassData.fromAPI({ ...keys2Camel(item) }),
            ),
          ];
        } else {
          this.setClassesList(res.data);
        }
      }

      const isLastPage = (meta) => meta.current_page >= meta.last_page;

      if (list === 'occurrences') {
        isLastPage(res.meta)
          ? (this.occurrencesStatus = 'completed')
          : (this.occurrencesStatus = 'idle');
      } else {
        isLastPage(res.meta)
          ? (this.exploreStatus = 'completed')
          : (this.exploreStatus = 'idle');
      }
    } catch (error) {
      console.log(error);
      this.errorMessage = error.message;
      if (list === 'occurrences') {
        this.occurrencesStatus = 'error';
      } else {
        this.exploreStatus = 'error';
      }
    }
  }

  *fetchClasses(page = 1) {
    const data = {};
    if (this.filterTitle) data.className = this.filterTitle;
    if (this.filterIsOnline !== null) data.is_online = this.filterIsOnline;
    if (this.filterAgeGroup.length > 0) data.ages = this.filterAgeGroup;

    yield this.fetchList(
      Object.entries(data).length > 0 ? 'filtered' : 'classes',
      page,
      data,
    );
  }

  *verifyStudent(studentId, teacherId) {

    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();
      const res = yield env.studentApi.verifyAccount(studentId, teacherId)
      console.log(res);
      if (res.block === true) {
        console.log('devia dar erro', res.block);
        throw new Error("Usuário inadimplente")
      }
      return true;
    } catch (error) {
      this.errorMessage = error.message;
      return false;
    }
  }

  *fetchRating(teacherId, comments = false) {

    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();
      if (comments) {
        const res = yield env.classDataApi.getRating(teacherId)
        const { data } = res
        this.setTeacherRatings(data)
        return true
      } else {
        const res = yield env.classDataApi.getRatingAvg(teacherId)
        this.setTeacherRatingScore(res)
        return res
      }
    } catch (error) {
      this.errorMessage = error.message;
      return false;
    }
  }

  *saveRating(studentId, teacherId, comment, avatar, name) {

    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();

      const res = yield env.classDataApi.saveRatingAvg({
        "id_customer": studentId,
        "id_teacher": teacherId,
        "comment": comment,
        "rating": this.rating,
        "avatar": avatar,
        "name": name
      })
      console.log('rating', res);
      return res

    } catch (error) {
      this.errorMessage = error.message;
      return false;
    }
  }

  *cancelOccurence(studentId, teacherId, classId) {

    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();

      const res = yield env.studentApi.cancelOccurence(studentId, teacherId, classId)
      console.log('cancel', res);
      return res

    } catch (error) {
      this.errorMessage = error.message;
      return false;
    }
  }

  *fetchOccurrences(page = 1) {
    yield this.fetchList('occurrences', page);
  }

  setClassesOccurrences(data) {
    this.classesOccurrences = data.map((item) =>
      item?.classTimetable ?
        ClassData.fromAPI({
          ...keys2Camel(item?.classTimetable?.class || {}),
          ...keys2Camel(item || {}),
          ...keys2Camel(item.classTimetable || {}),
          classTime: item?.classTimetable?.time,
          classTimeId: item?.classTimetable?.id,
          classOccurrenceId: item.id,
          occurrenceStatus: item.status,
          attendanceStatus: item.attendance_status.status,
        }) : null
    ).filter(e => e !== null);
  }

  setClassesList(data) {
    if (data) {
      this.classesList = data.map((item) =>
        ClassData.fromAPI({ ...keys2Camel(item) }),
      );
    } else this.classesList = [];
  }

  cleanFilter() {
    this.filteredClasses = [];
    this.filterTitle = '';
    this.filterIsOnline = null;
    this.filterAgeGroup = [];
  }
}
