import { makeObservable, observable } from 'mobx';

/**
 * @typedef StudentConstructor
 * @property {number} id
 * @property {string} [name]
 * @property {string} [lastName]
 * @property {string} [birthdate]
 * @property {string} [cpf]
 * @property {string} [phone]
 * @property {string} [email]
 * @property {string} [image]
 * @property {string} [school]
 */
export default class Student {
  /**
   * Identificador único do estudante
   * @type {number}
   */
  id = null;

  /**
   * Nome do estudante
   * @type {string}
   */
  name = null;

  /**
   * Sobrenome do estudante
   * @type {string}
   */
  lastName = null;

  /**
   * Data de nascimento
   * @type {string}
   */
  birthdate = null;

  /**
   * Número de CPF
   * @type {string}
   */
  cpf = null;

  /**
   * Número de contato do estudante
   * @type {string}
   */
  ddd = null;

  /**
   * Número de contato do estudante
   * @type {string}
   */
  phone = null;

  /**
   * Endereço de e-mail do estudante
   * @type {string}
   */
  email = null;

  /**
   * Imagem de perfil do estudante
   * @type {string}
   */
  image = null;

  /**
   * Escola
   * @type {string}
   */
  // school = null;

  constructor(newStudent) {
    makeObservable(this, {
      id: observable,
      name: observable,
      lastName: observable,
      birthdate: observable,
      cpf: observable,
      ddd: observable,
      phone: observable,
      email: observable,
      // school: observable,
    });

    if (newStudent == null) {
      throw new Error('Invalid student constructor');
    }

    /* Extraindo dados de newStudent */
    const {
      id,
      name,
      lastName,
      birthdate,
      cpf,
      ddd,
      phone,
      email,
      image,
      // school,
    } = newStudent;

    this.id = id || '';
    this.name = name || '';
    this.lastName = lastName || '';
    this.birthdate = birthdate || '';
    this.cpf = cpf || '';
    this.ddd = ddd || '';
    this.phone = phone || '';
    this.email = email || '';
    this.image = image || '';
    // this.school = school || '';
  }

  static fromApi({
    id,
    name,
    last_name: lastName,
    birthdate,
    cpf,
    ddd,
    telephone: phone,
    contact_email: email,
    image,
    // school,
  } = {}) {
    return new Student({
      id,
      name,
      lastName,
      birthdate,
      cpf,
      ddd,
      phone,
      email,
      image,
      // school,
    });
  }
}
