require('dotenv').config();
const term = require("../util/terminal");
const renderProcess = require("../api/render");
const Gado = require('../model/GadoModel');
const StreamData = require('../util/stream');
const sequelize = require("../db/db");
const userData = require('../util/userData');

const API_URL = (process.env.ONPEC == 'LOCAL')
? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

/**
 * Controller responsável manipular dados de 'Gado'.
 *
 * @param {string} brinco - O número de identificação do gado (entre 4 e 20 caracteres).
 * @param {string} sexo - O sexo do gado (até 1 caractere).
 * @param {string} raca - A raça do gado (até 20 caracteres).
 * @param {string} lote - O lote do gado (até 20 caracteres).
 * @param {string} pasto - O pasto onde o gado está (até 20 caracteres).
 * @param {number} peso - O peso do gado (entre 0.0 e 2000.0).
 * @param {string} fase - A fase do gado (até 1 caractere).
 *
 * @returns {Promise<Object>} - Retorna um objeto com o status da operação e os dados do Gado.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */

const GadoControl = {
  /**
   * @param {string} filters - Um objeto onde propriedades são as colunas da tabela.
  */
  async count(filters = {}) {
    try {
      const response = await Gado.count({ where: filters });
      return response;
      
    } catch (error) {
      term(error);
      return false;
    }
  },
  
  async list(filters = {}) {
    try {
      const response = await Gado.findAll({ where: filters });
      return response;
      
    } catch (error) {
      term(error);
      return false;
    }
  },

  /**
   * Sincroniza as pesagens com a API usando a data mais recente como referência.
   *
   * @returns {Promise<object>} - Retorna um objeto com os resultados da busca se a operação for bem-sucedida, ou false em outros casos.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   * @property {Array} response.data - Retorna um Array com dados atualizados de Gado.
   */
  async push() {
    try {
      const response = await fetch(`${API_URL}/api/gado/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          client: JSON.stringify(await userData())
        },
        body: null
      });
  
      if (!response.body) {
        throw new Error('ReadableStream não disponível');
      }

      const data = await StreamData.read(response.body.getReader());

      term('Baixando dados de Gado', data);
      return data;

    } catch (error) {
      term(error);
      return false;
    }
  },

  async import(data, window, proc, step) {
    let transaction;
    let count = 0;

    try {
      transaction = await sequelize.transaction();
        
      renderProcess(
        window,
        proc,
        {
          step: `Passo ${step}\n\n- Tabela Gado`,
          msg: `Sincronizados: ${count} de ${data.length}`
        }
      );

      for (const item of data) {
        //console.log(item);
        await Gado.upsert(item, {
          transaction,
          fields: [
            'brinco', 'sexo', 'raca', 'lote', 'pasto', 'peso', 'fase',
          ]
        });
  
        count++;

        if (count % 1000 === 0 || count === data.length) {
          await transaction.commit(); // Faz commit da transacao atual a cada X iteracoes
          transaction = await sequelize.transaction(); // Inicia uma nova transacao
          
          renderProcess(
            window,
            proc,
            {
              msg: `Sincronizados: ${count} | Total: ${data.length}`
            }
          );
        }
      }

      await transaction.commit();

      return true;

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      await transaction.rollback();
      return false;
    }
  },
}

module.exports = GadoControl;
