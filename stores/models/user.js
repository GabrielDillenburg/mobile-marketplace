import { makeObservable, observable } from 'mobx'

/**
 * @typedef UserConstructor
 * @property {number} id
 * @property {string} [name]
 * @property {string} [email]
 */
export default class User {
  /**
   * Identificador único de usuário
   * @type {number}
   */
  id = null;

  /**
   * Nome do usuário
   * @type {?string}
   */
  name = null;

  /**
   * Email do usuário
   * @type {?string}
   */
  email = null;

  /* Outros campos */

  /**
   * Creates an instance of Contract.
   * @param {UserConstructor} newUser
   * @throws {Error}
   * @memberof User
   * @since 1.0.0
   */
  constructor(newUser) {
    makeObservable(this, {
      id: observable,
      name: observable,
      email: observable
      /* Os mesmos campos definidos em outros campos */
    })

    if (newUser == null || newUser.id == null) {
      throw new Error('Invalid user constructor');
    }

    /* Extraindo dados de newUser */
    const { id, name, email } = newUser;

    /**
     * Adicionar tratamentos necessários antes de salvar na instância
     * Como validações de formato de dado.
     *
     * !IMPORTANTE: transformação de dados não deve ser realizada aqui
     * Manipulação dos dados deve ser realizada no retorno dos dados da api.
     * Outra solução seria uma função static que trata os dados e retorna uma instância
     * deste mesmo componente como exemplificado na função fromApi
     *
     * Com isso garante que se os dados presentes no mobx podem ser salvados
     * e carregados de forma correta do local ou session storage
     */

    this.id = id;
    this.name = name || '';
    this.email = email || '';
  }

  /**
   * Esta função converte um json desconhecido para um usuário
   * não a necessidade de validar se irá criar um usuário válido
   * que esta funcionalidade foi encarregada ao construtor.
   *
   * !IMPORTANTE: Ainda assim é necessário valida as chaves do json antes de as acessar
   *
   * @param {Record<string, unknown>} json
   * @returns {User} uma nova instância de usuário
   */
  static fromApi(json) {
    /**
     * EXEMPLO:
     *
     * POST api/v1/authenticate username password
     *
     * RESPONSE { id: 1, first_name: John, last_name: Doe, mail: john.doe@not-a-fake-mail.com }
     */

    const id = json?.id || null;
    const name = `${json?.first_name} ${json?.last_name}`.trim()
    const email = json?.mail || ''

    return new User({ id, name, email })
  }
}