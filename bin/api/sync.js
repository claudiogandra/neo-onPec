const { performance } = require('perf_hooks');
const Table = require('../db/table');
const BKP = require('../db/bkp');
const term = require('../util/terminal');
const SyncControl = require('../controller/SyncControl');

const sync = async (window = false, proc, step) => {
  try {
    // 1 - Faz BKP do estado atual do DB local
    await BKP.db();
    term('Backup local realizado');

    const tables = await Table.config();

    if (window === false) return;
    if (tables === false) tables = await Table.config();

    // 2 - Somente tabelas que podem ter fila
    const dimensions = tables
      .filter(t => t.exec)
      .sort((a, b) => a.priority - b.priority);

    const queues = tables
      .filter(t => t.queue)
      .sort((a, b) => a.priority - b.priority);

    window.setProgressBar(0.6);

    // 3 - Verifica data da ultima sincronizacao
    const mostRecentDate = await SyncControl.mostRecentDate();
    term(`MOST RECENT: ${mostRecentDate.result}`);

    // 6 - Sincroniza demais tabelas que nao possuem queue
    for (const table of dimensions) {
      if (table.exec === true) {
        const Control = require(`../controller/${table.model}Control`);
        const resultData = await Control.push();

        if (resultData.result === true) {

          const startTime = performance.now();
          const resultImport = await Control.import(
            resultData.data,
            window,
            proc,
            step
          );

          term(`${resultImport} | ${(performance.now() - startTime) / 1000} segundos`);
        }
      }
    }
  
    // 3 - Verifica se existe alguma tabela com queue
    if (queues.length > 0) for (const queue of queues) {
      const Control = require(`../controller/${queue.model}Control`);
      const QueueControl = require(`../controller/${queue.model}QueueControl`);
  
      const dataUpload = await QueueControl.queue();
      if (dataUpload.length > 0) await QueueControl.upload(dataUpload);
      
      // 4 - Método que verifica dados pendentes para baixar
      const resultData = await Control.push(mostRecentDate.result);
  
      if (resultData.result === true) {
        
        const startTime = performance.now();
        // 5 - Caso existirem novos dados, realiza o import
        const resultImport = await Control.import(
          resultData.data,
          window,
          proc,
          step
        )
  
        term(`${resultImport} | ${(performance.now() - startTime) / 1000} segundos`);
      }
    }

    return;
    
  } catch (error) {
    term('SYNC', error);
    throw new Error(error);
  }
}

module.exports = { sync };
