require('dotenv').config();
const term = require("../util/terminal");
const renderProcess = require("../api/render");
const GadoRaca = require('../model/GadoRacaModel');
const StreamData = require('../util/stream');
const sequelize = require("../db/db");
const userData = require('../util/userData');

const API_URL = (process.env.ONPEC == 'LOCAL')
? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

/**
 * Controller responsável manipular dados de 'Gado Raca'.
 *
 * @param {string} sigla - A sigla da fase (até 3 caracteres).
 * @param {number} raca - O nome da fase (até 30 caracteres).
 * @param {string} descricao - A descrição do pasto (até 255 caracteres).
 *
 * @returns {Promise<Object>} - Retorna um objeto com o status da operação e os dados do GadoRaca.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */

const GadoRacaControl = {
  
  async get() {
    try {
      const response = await GadoRaca.findAll();
      term(response);
      return response;
      
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  /**
   * Sincroniza as pesagens com a API usando a data mais recente como referência.
   *
   * @returns {Promise<object>} - Retorna um objeto com os resultados da busca se a operação for bem-sucedida, ou false em outros casos.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   * @property {Array} response.data - Retorna um Array com dados atualizados de Gado Raca.
   */
  async push() {
    try {
      const response = await fetch(`${API_URL}/api/gadoraca/push`, {
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

      term('Baixando dados de Raça', data);
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

      await GadoRaca.sync({ freezeTableName: true });
        
      renderProcess(
        window,
        proc,
        {
          step: `Passo ${step}\n\nTabela Gado Raça`,
          msg: `Sincronizados: ${count} de ${data.length}`
        }
      );

      for (const item of data) {
        //console.log(item);
        await GadoRaca.upsert(item, {
          transaction,
          fields: [
            'sigla', 'raca', 'descricao', 'createdAt',
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

module.exports = GadoRacaControl;
