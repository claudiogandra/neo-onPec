require('dotenv').config();
const term = require('../util/terminal');
const userData = require('../util/userData');
const Sync = require('../model/SyncModel');
const StreamData = require('../util/stream');
const sequelize = require('../db/db');

const API_URL = (process.env.ONPEC == 'LOCAL')
  ? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

const SyncControl = {
  async mostRecentDate() {
    try {
      const result = await Sync.getLastCreatedAt();
      return (result !== null) ? result : await this.push();

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      throw new Error('SYNC - Erro ao buscar mostRecentDate: ' + error.message);
    }
  },

  async push(mostRecentDate = false) {
    try {
      const response = await fetch(`${API_URL}/api/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          client: JSON.stringify(await userData()),
          datagreater: JSON.stringify(mostRecentDate),
        },
        body: null
      });
  
      if (!response.body) {
        throw new Error('ReadableStream não disponível');
      }
      
      // Processa a resposta do stream
      const data = await StreamData.read(response.body.getReader());

      term('Baixando dados de Sync');
      return data;
  
    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  },

  async import(data) {
    let transaction;
    let count = 0;
    
    try {
      transaction = await sequelize.transaction();

      for (const item of data) {
        await Sync.upsert(item, transaction);
        count++;

        if (count % 1000 === 0) {
          await transaction.commit();
          transaction = await sequelize.transaction();
        }
      }
      return true;

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      throw new Error('SYNC - Erro ao importar dados: ' + error.message);
    }
  },

  async resetTable() {
    try {
      // Excluir todos os registros da tabela
      await Sync.destroy({ truncate: true });

      term('Sync redefinida');
      return true;
      
    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  }
}

module.exports = SyncControl;
