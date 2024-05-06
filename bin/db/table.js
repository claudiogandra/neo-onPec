const fs = require('fs');
const path = require('node:path');
const sequelize = require('./db');
const term = require('../util/terminal');
const { mostRecentDate } = require('../controller/SyncControl');

// Verificar a tabela local
const Table = {
  async config() {
    // Lê o arquivo de tabelas padrão
    try {
      const conteudo = await fs.promises.readFile(path.join(__dirname, './table.config'), 'utf8');
      const dados = JSON.parse(conteudo);
      return dados;

    } catch (error) {
      term(error);
      throw error;
    }
  },

  async check(table) {
    try {
      // Verificar se a tabela existe no banco de dados
      await sequelize.getQueryInterface().describeTable(table.name);
      if (table.queue === true) await sequelize.getQueryInterface().describeTable(`${table.name}_queue`);
      
      // Tabela existe
      return {
        result: 4,
        msg: `"${table.desc}" verificada`
      };

    } catch (error) {
      if (!`${error}`.includes('No description found')) term(`Table Check:\n${error}`);
      
      try {
        // Criar tabela
        const Model = require(`../model/${table.model}Model`);
        await Model.sync({ freezeTableName: true });
        term(`Table Check: ${table.model} criada`);

        if (table.queue === true) {
          await sequelize.getQueryInterface().describeTable(`${table.name}_queue`);
        }

        // Tabela criada
        return {
          result: 4,
          msg: `"${table.desc}" criada`
        };

      } catch (err) {
        term(err);

        try {
          // Criar tabela de Fila
          const Queue = require(`../model/${table.model}QueueModel`);
          await Queue.sync({ freezeTableName: true });
          term(`Table Check: ${table.model}Queued criada`);

          // Tabela modelo e fila criadas
          return {
            result: 4,
            msg: `"${table.desc}" model e fila criadas`
          };
          
        } catch (e) {
          term(err);

          return {
            result: false,
            msg: `Erro: "${table.desc} - queued: ${table.queue}" = ${e.message}`
          };
        }
      }
    }
  },

  async update(table, mostRecentDate = false) {
    try {
      if (table.exec === true && table.exec === 'true') {
        const Controller = require(`./controller/${table.model}Control`);
        await Controller.resetTable();
        const response = await Controller.push(mostRecentDate);

        return {
          result: 5,
          msg: `Tabela atualizada ${table.desc}`
        };
      } else {
        return false;
      }

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      throw error;
    }
  }
}

module.exports = Table;
