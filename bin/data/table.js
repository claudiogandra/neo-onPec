const fs = require('fs');
const path = require('node:path');
const sequelize = require('./db');
const term = require('../resources/terminal');

// Verificar a tabela local
const Table = {
  async config () {
    // Lê o arquivo de tabelas padrão
    const conteudo = await fs.promises.readFile(path.join(__dirname, './table.config'), 'utf8');
    const dados = JSON.parse(conteudo);
    return dados;
  },

  async check (table) {
    try {
      // Verificar se a tabela existe no banco de dados
      await sequelize.getQueryInterface().describeTable(table.name);
      return {
        result: 1,
        msg: `"${table.desc}" atualizada`
      };

    } catch (error) {
      try {
        // Criar a tabela com base no modelo
        const Model = require(`../model/${table.model}Model`);
        await Model.sync({ freezeTableName: true });
      
        return {
          result: 2,
          msg: `"${table.desc}" criada`
        };

      } catch (e) {
        term(`Erro: ${e.message}`);

        return {
          result: false,
          msg: `Erro: "${table.desc}" = ${e}`
        };
      }
    }
  }
}

module.exports = Table;
