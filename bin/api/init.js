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
    let step = 1;

    // Faz BKP do estado atual do DB local
    await BKP.db();
    window.setProgressBar(0.1);
    await renderProcess(
      window,
      'introLog',
      { step: `Passo ${step++}`, msg: `Backup de dados local criado` }
    );
    await sleep(2000);
    
    // Método conecta ao banco local
    await sequelize.authenticate();
    window.setProgressBar(0.2);
    await renderProcess(
      window,
      'introLog',
      { step: `Passo ${step++}`, msg: `Banco local ativo` }
    );
    await sleep(2000);

    // Criar/Atualizar tabelas do banco local
    const tables = await Table.config();
    window.setProgressBar(0.3);
    for (const table of tables) {
      const checked = await Table.check(table);
      await renderProcess(
        window,
        'introLog',
        { step: `Passo ${step++}`, msg: `Verificando tabela "${checked.msg}"` }
      );
      await sleep(1000);
    }

    // Método que verifica dados pendentes
    window.setProgressBar(0.6);
    const dataPending = true;
    await renderProcess(
      window,
      'introLog',
      {
        step: `Passo ${step++}`,
        msg: (dataPending) ? `Sincronizando pendentes` : `Não há pendências}` }
    );
    await sleep(2000);

    // Inicia a aplicação
    window.setProgressBar(0.9);
    await renderProcess(
      window,
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
