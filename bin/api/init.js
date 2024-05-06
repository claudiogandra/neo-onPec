require('dotenv').config();
const sequelize = require('../db/db');
const BKP = require('../db/bkp');
const Table = require('../db/table');
const sleep = require('../util/sleep');
const term = require('../util/terminal');
const renderProcess = require('./render');

const init = async (window, version = false) => {
  term(`INIT START${(!version) ? ' | Versão: ' + version : ''}`);

  try {
    window.setProgressBar(0.0);
    let step = 0;

    // 1 - Faz BKP do estado atual do DB local
    await BKP.db();
    window.setProgressBar(0.1);
    await renderProcess(
      window.webContents,
      'introLog',
      { step: `Passo ${step++}`, msg: `Backup de dados local criado` }
    );
    await sleep(2000);
    
    // 2 - Método conecta ao banco local
    await sequelize.authenticate();
    window.setProgressBar(0.2);
    await renderProcess(
      window.webContents,
      'introLog',
      { step: `Passo ${step++}`, msg: `Banco local ativo` }
    );
    await sleep(2000);

    // 3 - Pegar esquema de tabelas
    const tables = await Table.config();
    window.setProgressBar(0.3);

    for (const table of tables) {
      // 4 - Criar/Atualizar esquema de tabelas do banco local
      const checked = await Table.check(table);
      
      await renderProcess(
        window.webContents,
        'introLog',
        { step: `Passo ${step++}`, msg: checked.msg }
      );
      await sleep(1000);
    }

    // 5 - Somente tabelas que podem ter fila
    const queues = tables.filter(t => t.queue);
    window.setProgressBar(0.6);

    // 5 - Verifica se existe alguma tabela com queue
    if (queues.length > 0) for (const queue of queues) {
      const Control = require(`../controller/${queue.model}Control`);
      const QueueControl = require(`../controller/${queue.model}QueueControl`);

      const dataUpload = await QueueControl.get();
      //const resultUpload = await Control.upload(queue.model, dataUpload);
      
      // Método que verifica dados pendentes para baixar
      const resultData = await Control.push();

      if (resultData.result === true) {
        const newData = resultData.data;
        step++
        let parcial = 0;
        const upsert = ((newData.upsert).length) ? (newData.upsert).length : 0;
        const destroy = ((newData.destroy).length) ? (newData.destroy).length : 0;
        const total =  upsert + destroy;

        if (upsert > 0) {
          term(`UPSERT: ${(newData.upsert).length}`);
          for (const item of newData.upsert) {
            parcial++;
            await renderProcess(
              window.webContents,
              'introLog',
              { step: `Passo ${step}`, msg: `Sincronizados: ${parcial} | Total: ${total}` }
            );
          }
        }

        if (destroy > 0) {
          term(`DESTROY: ${(newData.destroy).length}`);
          for (const item of newData.destroy) {
            parcial++;
            await renderProcess(
              window.webContents,
              'introLog',
              { step: `Passo ${step}`, msg: `Sincronizados: ${parcial} | Total: ${total}` }
            );
          }
        }

        term(`TOTAL: ${total}`);
      }
    }


    // Inicia a aplicação
    window.setProgressBar(0.9);
    await renderProcess(
      window.webContents,
      'introLog',
      { step: '\n', msg: `Iniciando . . .` }
    );
    await sleep(3000);

    window.setProgressBar(1.0);
    return;

  } catch (error) {
    // Criar método de arquivo de erros 'logDBerrors'
    term(error);
    throw error;
  }
}

module.exports = { init };
