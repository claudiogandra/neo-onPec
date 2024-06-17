require('dotenv').config();
const sequelize = require('../db/db');
const Table = require('../db/table');
const term = require('../util/terminal');
const renderProcess = require('./render');
const sleep = require('../util/sleep');
const { sync } = require('./sync');
const getUnidade = require('../util/userData');

const init = async (window, version = false) => {
  term(`INIT START${(!version) ? ' | Versão: ' + version : ''}`);

  renderProcess(
    window.webContents,
    'introLog',
    { step: `Verificação de Segurança`, msg: `Analisando sua conexão . . .` }
  );

  try {
    const userNetwork = await getUnidade();

    if (userNetwork.unidade === false) {

      renderProcess(
        window.webContents,
        'introLog',
        { step: `Verificação de Segurança`, msg: `Rede atual não permitida` }
      );

      await sleep(3000);

      renderProcess(
        window.webContents,
        'introLog',
        { step: `Verificação de Segurança`, msg: `Encerrando aplicação . . .` }
      );

      await sleep(2000);
      
      throw new Error('Rede não permitida');
    }

    window.setProgressBar(0.0);
    let step = 0;
    
    // 1 - Método conecta ao banco local
    await sequelize.authenticate();
    window.setProgressBar(0.2);

    renderProcess(
      window.webContents,
      'introLog',
      { step: `Passo ${step++}`, msg: `Banco local ativo` }
    );
    
    await sleep(500);

    // 2 - Pegar esquema de tabelas
    const tables = await Table.config();
    window.setProgressBar(0.3);

    for (const table of tables) {
      // 3 - Criar/Atualizar esquema de tabelas do banco local
      const checked = await Table.check(table);
      
      renderProcess(
        window.webContents,
        'introLog',
        { step: `Passo ${step++}`, msg: checked.msg }
      );

      await sleep(500);
    }

    window.setProgressBar(0.4);
    // 4 - Tratar sincronizacao de tabelas
    await sync(tables, window, step++);

    await sleep(500);

    // Inicia a aplicação
    window.setProgressBar(0.9);
    
    renderProcess(
      window.webContents,
      'introLog',
      { msg: `Iniciando . . .` }
    );

    window.setProgressBar(1.0);
    return;

  } catch (error) {
    // Criar método de arquivo de erros 'logDBerrors'
    term(error);
    throw error;
  }
}

module.exports = { init };
