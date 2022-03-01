const DEFAULT_TIMEOUT = 15000;

export class PromiseTimeoutError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'PromiseTimeoutError';
  }
}

/**
 * Função para envolopar promises e permirtir que eles tenham um
 * tempo limite para execução
 *
 * IMPORTANTE: não utilizar para funções fetch que precisam sofrer Controller.abort()
 * já que esta função não aborta a chamada REST e apenas garante que o usuário não irá ficar
 * pendurado em uma promise eterna
 *
 * @template T
 * @param {Promise<T>} promise - Promise a ser executada
 * @param {number} [ms=20000] - Tempo em milisegundos
 * @throws {PromiseTimeoutError} - Lança a exceção se o tempo máximo declarado estourar
 * @returns {Promise<T>} a promise envelopada por esta função
 */
export const timeoutPromise = (promise, ms = DEFAULT_TIMEOUT) => {
  const _ms = ms && ms > 0 ? ms : DEFAULT_TIMEOUT;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new PromiseTimeoutError(`Promise timed out after ${_ms} milliseconds.`),
      );
    }, _ms);

    promise
      .then((res) => resolve(res))
      .catch((error) => reject(error))
      .finally(() => clearTimeout(timeout));
  });
};
