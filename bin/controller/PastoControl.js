require('dotenv').config();
const term = require("../util/terminal");
const renderProcess = require("../api/render");
const PastoModel = require('../model/PastoModel');
const StreamData = require('../util/stream');
const sequelize = require("../db/db");
const userData = require('../util/userData');

const API_URL = (process.env.ONPEC == 'LOCAL')
? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

/**
 * Controller responsável manipular dados de 'Pasto'.
 *
 * @param {string} pasto - O número do pasto (até 20 caracteres).
 * @param {number} unidade - O número da unidade.
 * @param {string} ciclo - O ciclo atual do pasto (até 20 caracteres).
 *
 * @returns {Promise<Object>} - Retorna um objeto com o status da operação e os dados do Pasto.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */

const PastoControl = {
  
  async list(filters = {}) {
    try {
      const response = await PastoModel.findAll();
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
   * @property {Array} response.data - Retorna um Array com dados atualizados de Gado Pasto.
   */
  async push() {
    try {
      const response = await fetch(`${API_URL}/api/pasto/push`, {
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

      term('Baixando dados de Gado Pasto', data);
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

      await PastoModel.sync({ freezeTableName: true });
        
      renderProcess(
        window,
        proc,
        {
          step: `Passo ${step}\n\n- Tabela Gado Pasto`,
          msg: `Sincronizados: ${count} de ${data.length}`
        }
      );

      for (const item of data) {
        //console.log(item);
        await PastoModel.upsert(item, {
          transaction,
          fields: [
            'pasto', 'unidade', 'ciclo', 'createdAt', 'status',
          ]
        });
  
        count++;
        
        renderProcess(
          window,
          proc,
          {
            msg: `Sincronizados: ${count} de ${data.length}`
          }
        );
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

module.exports = PastoControl;
