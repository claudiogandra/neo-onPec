/**
 * Servico responsavel por lidar com operacoes relacionadas a dados de pesagem de gado em fila.
 * 
 * @typedef {Object} GadoEventosQueued - Model da tabela 'gado_eventos_queued'.
 *
 * @param {object} dados - Contém as propriedades abaixo:
 * @property {number} id - O ID do evento.
 * @property {string} brinco - O numero de identificacao do brinco.
 * @property {string} sexo - O sexo do brinco.
 * @property {string} raca - A raça do brinco.
 * @property {string} lote - O lote do brinco.
 * @property {string} pasto - O pasto do brinco.
 * @property {string} data - A data do evento no formato "YYYY-MM-DD hh:mm:ss".
 * @property {number} peso - O peso do brinco.
 * @property {string} fase - A fase do brinco.
 */

const term = require("../util/terminal");
const GadoEventosQueued = require("../model/GadoEventosQueueModel");
const StreamData = require("../util/stream");

const API_URL = (process.env.ONPEC == 'LOCAL')
? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

/**
 * Busca os dados pendentes de sincronizacao
 * 
 * @returns {Promise<GadoEventosQueued>} - Retorna a lista de registros pendentes para sincronizacao.
 * @throws {Error} - Lanca um erro se ocorrer algum problema durante a operacao.
 */
const GadoEventosQueuedControl = {
  async queue() {
    try {
      const result = await GadoEventosQueued.findAll({
        order: [['updatedAt', 'ASC']],
      });

      term("Pendentes: ", result);
      return result;
      
    } catch (error) {
      term("Pendentes ERROR: ", error);
      throw new Error(error, '\nErro ao buscar os dados:\n');
    }
  },

  async upload(dataUpload) {
    term('Preparando Upload de GADO EVENTOS');

    try {
      const response = await fetch(`${API_URL}/api/gadoeventos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataUpload)
      });

      if (!response.body) {
        throw new Error('ReadableStream não disponível');
      }

      // Processa a resposta do stream
      const data = await StreamData.read(response.body.getReader());

      return data;

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  },

  /**
   * Cria ou atualiza uma entrada de evento de gado em fila.
   *
   * @returns {Promise<GadoPesagem>} - Retorna um objeto representando o evento apos a operacao de upsert.
   * @throws {Error} - Lanca um erro se ocorrer algum problema durante a operacao.
   */
  async upsert(dados) {
    try {
      // Cria ou atualiza a entrada de evento de gado em fila
      const response = await GadoEventosQueued.upsert(
        dados,
        {
          where: {
            brinco: dados.brinco,
            data: dados.data,
            action: dados.action
          }
        }
      );

      return response.data;

    } catch (error) {
      throw new Error('Erro ao inserir/atualizar os dados:\n', error.message);
    }
  },

  async delete(dados) {
    try {
      const { brinco, data, updatedAt } = dados;

      const queuedData = await GadoEventosQueued.destroy({
        where: {
          brinco: brinco, data: data,
        }
      });

      return queuedData;
      
    } catch (error) {
      console.log(error);
    } finally {
      return;
    }
  },

  /**
   * Exclui uma entrada de evento de gado em fila com acao especifica.
   *
   * @returns {Promise<number>} - Retorna o numero de linhas excluidas.
   * @throws {Error} - Lanca um erro se ocorrer algum problema durante a operacao.
   */
  async clean(dados) {
    try {
      const { brinco = false, data = false, action = false } = dados;
      if (brinco === false || data === false || action === false) throw new Error('EVENTO QUEUE CLEAN: Incompleto');

      const deletedRows = await GadoEventosQueued.destroy({
        where: {
          brinco: brinco,
          data: data,
          action: action
        }
      });

      return deletedRows;

    } catch (error) {
      throw new Error('Erro ao deletar os dados:\n', error.message);
    }
  }
};

module.exports = GadoEventosQueuedControl;
