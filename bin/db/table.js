const fs = require('fs');
const path = require('node:path');
const sequelize = require('./db');
const term = require('../util/terminal');

// Verificar a tabela local
const Table = {
  async config () {
    // Lê o arquivo de tabelas padrão
    try {
      const conteudo = await fs.promises.readFile(path.join(__dirname, './table.config'), 'utf8');
      const dados = JSON.parse(conteudo);
      return dados;

    } catch (error) {
      throw error;
    }
  },

  async check (table) {
    try {
      // Verificar se a tabela existe no banco de dados
      await sequelize.getQueryInterface().describeTable(table.name);
      
      // Tabela atualizada
      return {
        result: 1,
        msg: table.desc
      };

    } catch (error) {
      term(`TableCheck:\n${error}`);
      try {
        // Criar tabela
        const Model = require(`../model/${table.model}Model`);
        await Model.sync({ freezeTableName: true });
        term(`TableCheck:\nTabela criada: ${table.model}`);
        
        // Tabela Criada
        return {
          result: 2,
          msg: table.desc
        };

      } catch (e) {
        term(e);

        return {
          result: false,
          msg: `Erro: "${table.desc}" = ${e.message}`
        };
      }
    }
  }
}

module.exports = Table;
