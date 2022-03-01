import { makeObservable, observable } from 'mobx';

/**
 * @typedef Responsibleonstructor
 * @property {number} id
 * @property {string} [name]
 * @property {string} [lastName]
 * @property {string} [relationship]
 * @property {string} [cpf]
 * @property {string} [ddd]
 * @property {string} [phone]
 * @property {string} [email]
 */
export default class Responsible {
  /**
   * Identificador único do responsável
   * @type {number}
   */
  id = null;

  /**
   * Nome do responsável
   * @type {string}
   */
  name = null;

  /**
   * Sobrenome do responsável
   * @type {string}
   */
  lastName = null;

  /**
   * Identificador de parentensco
   * @type {string}
   */
  relationship = null;

  /**
   * Número de CPF
   * @type {string}
   */
  cpf = null;

  /**
   * Número de contato do responsável
   * @type {string}
   */
  ddd = null;

  /**
   * Número de contato do responsável
   * @type {string}
   */
  phone = null;

  /**
   * Endereço de e-mail do responsável
   * @type {string}
   */
  email = null;

  constructor(newResponsible) {
    makeObservable(this, {
      id: observable,
      name: observable,
      lastName: observable,
      relationship: observable,
      cpf: observable,
      ddd: observable,
      phone: observable,
      email: observable,
    });

    if (newResponsible == null) {
      throw new Error('Invalid responsible constructor');
    }

    /* Extraindo dados de newResponsible */
    const {
      id,
      name,
      lastName,
      relationship,
      cpf,
      ddd,
      phone,
      email,
    } = newResponsible;

    this.id = id || '';
    this.name = name || '';
    this.lastName = lastName || '';
    this.relationship = relationship || '';
    this.cpf = cpf || '';
    this.ddd = ddd || '';
    this.phone = phone || '';
    this.email = email || '';
  }

  static fromApi({
    id,
    name,
    last_name: lastName,
    relatedness: relationship,
    cpf,
    ddd,
    telephone: phone,
    contact_email: email,
  } = {}) {
    return new Responsible({
      id,
      name,
      lastName,
      relationship,
      cpf,
      ddd,
      phone,
      email,
    });
  }
}
