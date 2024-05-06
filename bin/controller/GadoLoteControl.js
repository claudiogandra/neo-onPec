require('dotenv').config();
const renderProcess = require('../api/render');
const GadoLote = require('../model/GadoLoteModel');
const StreamData = require('../util/stream');
const userData = require('../util/userData');
const url = (process.env.ONPEC == 'DEV') 
  ? 'Desenvolvimento' 
  : 'Produção';

/**
 * Controller responsável manipular dados de 'Gado Lote'.
 *
 * @param {string} lote - O número do lote (até 20 caracteres).
 * @param {number} unidade - O número da unidade.
 * @param {string} descricao - A descrição do lote (até 255 caracteres).
 *
 * @returns {Promise<Object>} - Retorna um objeto com o status da operação e os dados do GadoLote.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */

const GadoLoteControl = {
  
  async get() {
    try {
      const response = await GadoLote.findAll();
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
   * @property {Array} response.data - Retorna um Array com dados atualizados de Gado Lote.
   */
  async push() {
    try {
      const response = await fetch(`${url}/api/gadolote/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          client: JSON.stringify(await userData())
        },
        body: null
      });
  
      /* if (!response.body) {
        throw new Error('ReadableStream não disponível');
      }
      
      // Processa a resposta do stream
      const data = await StreamData.read(response.body.getReader()); */

      term('Baixando dados de Sync', response.data.data);
      return response.data;

    } catch (error) {
      term(error);
      return false;
    }
  },

  async import(data = [], window, proc, step) {
    let count = 0;
    const transaction = await sequelize.transaction();

    try {
      await GadoLote.sync({ freezeTableName: true });

      for (const item of data) {
        //console.log(item);
        await GadoLote.upsert(item, {
          transaction,
          fields: [
            'lote',
            'unidade',
            'descricao',
          ]
        });
  
        count++;
        
        await renderProcess(
          window,
          proc,
          {
            step: step,
            message: `Sincronizando dados da nuvem\n> Gado Lote: ${count} de ${data.length}`
          }
        );
      }

      await transaction.commit();
      console.log('Dados Gado Lote inseridos/atualizados com sucesso.');
      return true;

    } catch (error) {
      console.error('Erro ao inserir/atualizar os dados:', error);
      await transaction.rollback();
      return false;
    }
  },
}

module.exports = GadoLoteControl;
