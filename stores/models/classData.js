import { action, computed, flow, makeObservable, observable } from 'mobx';
import { getEnv, getRoot } from 'mobx-easy';
import Toast from 'react-native-toast-message';

import AgeGroups from '../../constants/AgeGroups';

/**
 * @typedef Teacher
 * @type {object}
 * @property {string} name
 * @property {string} [introduction]
 * @property {Image[]} [images]
 */

/**
 * @typedef Timetable
 * @type {object}
 * @property {number} id
 * @property {string} weekdays
 * @property {'morning' | 'afternoon' | 'night'} [shift]
 * @property {string} time
 * @property {string} duration
 */

/**
 * @typedef Location
 * @property {string} address_cep
 * @property {string} address
 * @property {string} address_number
 * @property {string} [address_complement]
 * @property {string} [address_neighborhood]
 * @property {string} address_city
 * @property {string} [address_state]
 */

/**
 * @typedef Image
 * @property {number} [id]
 * @property {string} url
 */

/**
 * @typedef ClassDataConstructor
 * @property {number} id
 * @property {string} title
 * @property {string} [description]
 * @property {number} [classTimeId]
 * @property {number} [classOccurrenceId]
 * @property {string} [occurrenceStatus]
 * @property {string} [cancelReason]
 * @property {string} [weekday]
 * @property {string} [datetime]
 * @property {string} [duration]
 * @property {Image[]} [images]
 * @property {number} [classTime]
 * @property {string} [ageGroup]
 * @property {Teacher} teacher
 * @property {Student} [student]
 * @property {Timetable[]} timetable
 * @property {Location} location
 * @property {string} attendanceStatus
 * @property {boolean} isOnline
 * @property {string} meetUrl
 * @property {number} value
 * @property {number} estimated_value
 * 
 */

const defaultoptions = Object.freeze({
  id: null,
  title: '',
  description: '',
  images: null,
  classTime: null,
  cancelReason: '',
  ageGroup: '',
  teacher: {},
  student: {},
  timetable: {},
  location: {},
  classTimeId: null,
  classOccurrenceId: null,
  occurrenceStatus: null,
  weekday: '',
  datetime: '',
  duration: '',
  attendanceStatus: '',
  isOnline: false,
  meetUrl: null,
  value: null,
  estimatedValue: null,
});

export default class ClassData {
  /**
   * Id
   * @type {number}
   */
  id = null;

  /**
   * Class title
   * @type {string}
   */
  title = '';

  /**
   * Class description
   * @type {string}
   */
  description = '';

  /**
   * Cover image
   * @type {string}
   */
  images = null;

  /**
   * Class time chosen for assignment
   * @type {boolean}
   */
  classTime = null;

  /**
   * Class cancel reason
   * @type {string}
   */
  cancelReason = '';

  /**
   * Age group
   * @type {string}
   */
  ageGroup = '';

  /**
   * Class address object
   * @type {Location}
   */
  location = {};

  /**
   * Teacher data object
   * @type {Teacher}
   */
  teacher = {};

  /**
   * Student data object
   * @type {Student}
   */
  student = {};

  /**
   * CLass timetable object
   * @type {Timetable}
   */
  timetable = {};

  /**
   * Current class time id
   * @type {number}
   */
  classTimeId = null;

  /**
   * Current class occurrence id
   * @type {number}
   */
  classOccurrenceId = null;

  /**
   * Class occurrence status
   * @type {string}
   */
  occurrenceStatus = null;

  /**
   * Current class' occurence weekday
   * @type {string}
   */
  weekday = '';

  /**
   * Current class' occurrence time
   * @type {string}
   */
  datetime = '';

  /**
   * Current class' occurrence duration
   * @type {string}
   */
  duration = '';

  /**
   * Current class' occurrence attendance status
   * @type {string}
   */
  attendanceStatus = '';

  /**
   * Flag stablishing online or in-person classes
   * @type {boolean}
   */
  isOnline = false;

  /**
   * Url for online class
   * @type {string}
   */
  meetUrl = '';

  /**
   * Value for class
   * @type {string}
   */
  value = 0;

  /**
  * Estimated value for class
  * @type {string}
  */
  estimatedValue = 0;

  privateClassId = null;

  constructor(options = {}) {
    makeObservable(this, {
      /** Observables */
      id: observable,
      title: observable,
      description: observable,
      images: observable,
      classTime: observable,
      cancelReason: observable,
      ageGroup: observable,
      location: observable,
      teacher: observable,
      student: observable,
      timetable: observable,
      classTimeId: observable,
      classOccurrenceId: observable,
      occurrenceStatus: observable,
      weekday: observable,
      datetime: observable,
      duration: observable,
      attendanceStatus: observable,
      isOnline: observable,
      meetUrl: observable,
      value: observable,
      estimatedValue: observable,
      privateClassId: observable,

      /** Computed */
      isExpected: computed,
      informedAbsence: computed,
      occurrenceCancelled: computed,

      /** Actions */
      setCancelReason: action,
      setClassTime: action,
      setClassTimeId: action,

      /** Async actions */
      studentAssignment: flow,
      assignStudent: flow,
      validateStudent: flow,
      unassignStudent: flow,
      checkinOrAbsence: flow,
      sendMail: flow,
    });

    if (options == null) {
      throw new Error('Invalid constructor');
    }

    const {
      id,
      title,
      description,
      images,
      classTime,
      cancelReason,
      ageGroup,
      location,
      teacher,
      student,
      timetable,
      classTimeId,
      classOccurrenceId,
      occurrenceStatus,
      weekday,
      datetime,
      duration,
      attendanceStatus,
      isOnline,
      meetUrl,
      privateClassId,
      value,
      estimatedValue,
    } = {
      ...defaultoptions,
      ...options,
    };

    this.id = id;
    this.title = title;
    this.description = description;
    this.images = images;
    this.classTime = classTime;
    this.cancelReason = cancelReason;
    this.ageGroup = ageGroup;
    this.location = location;
    this.teacher = teacher;
    this.student = student;
    this.timetable = timetable;
    this.classTimeId = classTimeId;
    this.classOccurrenceId = classOccurrenceId;
    this.occurrenceStatus = occurrenceStatus;
    this.weekday = weekday;
    this.datetime = datetime;
    this.duration = duration;
    this.attendanceStatus = attendanceStatus;
    this.isOnline = isOnline;
    this.meetUrl = meetUrl;
    this.privateClassId = privateClassId;
    this.value = value;
    this.estimatedValue = estimatedValue;
  }

  get isExpected() {
    return this.attendanceStatus === 'expected';
  }

  get informedAbsence() {
    return this.attendanceStatus === 'absent_warned';
  }

  get checkedIn() {
    return this.attendanceStatus === 'checked_in';
  }

  get occurrenceCancelled() {
    return this.occurrenceStatus === 'cancelled';
  }

  /** Custom setters for class scheduling. */
  /** Set class time: */
  setClassTime(classTime) {
    this.classTime = classTime;
  }

  /** Set class id: */
  setClassTimeId(classId) {
    this.classTimeId = classId;
  }

  /** Invoked by canceling modal's inner form. */
  setCancelReason(response) {
    this.cancelReason = response;
  }

  /**
   * Common call to common endpoint decided only by boolean @property status.
   * @property absent_reason informed only for backend complience.
   */
  *checkinOrAbsence(payload) {
    try {
      const { status, comments } = payload;

      /** @type {import('../createRootStore').Env} */
      const env = getEnv();
      const res = yield env.classDataApi.checkinOrAbsence(
        this.classOccurrenceId,
        {
          status,
          absent_reason: comments?.length ? comments : '',
        },
      );

      if (res) return true;

      return false;
    } catch (error) {
      this.errorMessage = error.message;
      this.status = 'error';
      return false;
    }
  }

  /**
   * Centralized function to endpoints for both assignment and unassignment of student.
   */
  *studentAssignment(assign) {
    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();
      const res = yield env.classDataApi.studentAssignment(
        assign,
        this.classTimeId,
        {
          time: this.classTime,
          cancel_reason: this.cancelReason ? this.cancelReason : '',
        },
      );

      if (res) return true;

      return false;
    } catch (error) {
      this.errorMessage = error.message;
      this.status = 'error';
      return false;
    }
  }

  /**
   * Centralized function to endpoints to validate user cards
   */
  *validateStudent(studentId) {
    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();
      const { profile: { id } } = this.teacher

      const res = yield env.studentApi.verifyAccount(studentId, id, this.estimatedValue)

      console.log('ruim', res, this.value, this.estimatedValue);

      if (!res) return false;

      if ('url' in res) return "NOT_HAS_FINANCIAL";

      if ('reason' in res) return "NOT_HAS_VALUE";

      return "HAS_FINANCIAL";
    } catch (error) {
      this.errorMessage = error.message;
      this.status = 'error';
      return false;
    }
  }

  /**
   * Invokes common assignment function with mandatory chosen class time from class details screen.
   */
  *assignStudent() {
    if (this.classTime == null || this.classTimeId == null) return false;
    const res = yield this.studentAssignment(true);
    this.setClassTime(null);
    this.setClassTimeId(null);

    if (res) {
      getRoot().classDataStore.cleanFilter();
      return res;
    }

    return false;
  }

  /** Invokes common assignment fuction informing current class time id, e.g. from class card. */
  *unassignStudent() {
    const res = yield this.studentAssignment(false);

    if (res) return true;

    return false;
  }

  /** Send user mail related to class */
  *sendMail() {
    try {
      /** @type {import('../createRootStore').Env} */
      const env = getEnv();
      const res = yield env.classDataApi.sendMail(this.privateClassId);

      if (res) return true;

      return false;
    } catch (error) {
      this.errorMessage = error.message;
      this.status = 'error';
      return false;
    }
  }

  static fromAPI({
    id,
    name: title,
    description,
    images,
    classTime,
    cancelReason,
    age,
    location,
    teacher,
    student,
    timetable,
    classTimeId,
    classOccurrenceId,
    occurrenceStatus,
    weekday,
    datetime,
    duration,
    attendanceStatus,
    isOnline,
    meetUrl,
    privateClassId,
    value,
    estimatedValue
  } = {}) {
    return new ClassData({
      id,
      title,
      description,
      images,
      classTime,
      cancelReason,
      ageGroup: AgeGroups[age],
      location,
      teacher,
      student,
      timetable,
      classTimeId,
      classOccurrenceId,
      occurrenceStatus,
      weekday,
      datetime,
      duration,
      attendanceStatus,
      isOnline,
      meetUrl,
      privateClassId,
      value,
      estimatedValue
    });
  }
}
