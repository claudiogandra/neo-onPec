require('dotenv').config();
const sequelize = require('../data/db');
const BKP = require('../data/bkp');
const sleep = require('../resources/sleep');
const term = require('../resources/terminal');
const renderProcess = require('./render');
const Table = require('../data/table');

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
      `Passo ${step++}\nBackup de dados local criado`
    );
    await sleep(3000);
    
    // Método conecta ao banco local
    await sequelize.authenticate();
    window.setProgressBar(0.2);
    await renderProcess(
      window,
      'introLog',
      `Passo ${step++}\nBanco local ativo`
    );
    await sleep(3000);

    // Criar/Atualizar tabelas do banco local
    const tables = await Table.config();
    window.setProgressBar(0.3);
    for (const table of tables) {
      const checked = await Table.check(table);
      await renderProcess(
        window,
        'introLog',
        `Verificando Tabelas\n${checked.msg}`
      );
      await sleep(2000);
    }

    // Método que verifica dados pendentes
    const dataPending = true;
    window.setProgressBar(0.6);
    await renderProcess(
      window,
      'introLog',
      (dataPending)
        ? `Passo ${step++}\nSincronizando dados pendentes`
        : `Passo ${step++}\nNão há dados pendentes`
    );
    await sleep(3000);

    // Inicia a aplicação
    window.setProgressBar(0.9);
    await renderProcess(
      window,
      'introLog',
      `\nIniciando . . .`
    );
    await sleep(3000);

    window.setProgressBar(1.0);
    return true;

  } catch (error) {
    // Criar método de arquivo de erros 'logDBerrors'
    term(error);
    return false;
  }
}

module.exports = { init };
