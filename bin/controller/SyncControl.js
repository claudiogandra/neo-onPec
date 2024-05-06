require('dotenv').config();
const Sync = require('../model/SyncModel');
const StreamData = require('../util/stream');
const userData = require('../util/userData');
const term = require('../util/terminal');

const SyncControl = {
  async mostRecentDate() {
    try {
      return await Sync.getLastCreatedAt();

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      throw new Error('SYNC MOST RECENT DATE - Erro ao buscar os dados: ' + error.message);
    }
  },

  async push(mostRecentDate = false) {
    try {
      const response = await fetch(`${url}/api/sync/push`, {
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
