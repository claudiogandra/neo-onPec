require('dotenv').config();
const BKP = require('../data/bkp');
const sequelize = require('../data/db');
const sleep = require('../resources/sleep');

const renderProgress = async (window, target, obj) => {
  window.webContents.send(target, obj);
  await sleep(750);
  return;
}

const init = async (window) => {
  if (process.env.ONPEC == 'DEV') console.log('INIT START');
  await sleep(750);

  try {
    window.setProgressBar(0.0);
    let step = 0;

    await BKP.db();
    window.setProgressBar(0.1);
    step++;
    await renderProgress(window, 'introLog', `Passo ${step}\nBKP Banco local finalizado`);
    if (process.env.ONPEC == 'DEV') console.log('INTRO', step);
    await sleep(3000);
    
    await sequelize.authenticate();
    window.setProgressBar(0.2);
    step++;
    await renderProgress(window, 'introLog', `Passo ${step}\nBanco local ativado`);
    if (process.env.ONPEC == 'DEV') console.log('INTRO', step);
    await sleep(3000);

    window.setProgressBar(1.0);
    await renderProgress(window, 'introLog', `\nIniciando aplicação...`);
    if (process.env.ONPEC == 'DEV') console.log('START APP');
    await sleep(3000);

    return true;

  } catch (error) {
    // Criar método de arquivo de erros 'logDBerrors'
    if (process.env.ONPEC == 'DEV') console.log(error);
    return false;
  }
}

module.exports = { init };
