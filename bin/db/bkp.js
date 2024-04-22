require('dotenv').config();
const fs = require('fs');
const path = require('path');
const term = require('../util/terminal');

const db = (process.env.ONPEC == 'DEV')
  ? path.join(__dirname, '../data/local.test.db')
  : path.join(__dirname, '../data/local.db');

const BKP = {
  async db() {
    try {
      await fs.promises.access(db, fs.constants.F_OK);

      const now = new Date();
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

      const extensao = path.extname(db);
      const nomeBase = path.basename(db, extensao);

      const novoNome = `${nomeBase}_${timestamp}${extensao}`;

      const novoCaminho = path.join(path.dirname(db), novoNome);

      await fs.promises.copyFile(db, novoCaminho);

      if (process.env.ONPEC == 'DEV') console.log(`Backup criado com sucesso: ${novoCaminho}`);
      return;

    } catch (error) {
      term(`BKP: ${error}`);
      try {
        await fs.promises.writeFile(db, '');

        if (process.env.ONPEC == 'DEV') console.log('DB criado'); // Criar método de arquivo de erros 'logDBerrors'
        return;

      } catch (error) {
        throw new Error('Ocorreu um erro ao fazer backup: ' + error.message);
      }
    }
  },

  async data(list) {
    // Pasta Documentos do usuario atual
    const userFolder = path.join(process.env.USERPROFILE, 'Documents');
    
    // Formatar data e hora atual
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const arquivo = path.join(userFolder, `${timestamp}.csv`);

    // Preparar dados para serem gravados
    let dataToAppend = '';
    for (const obj of list) {
      dataToAppend += Object.values(obj).join(',') + '\n';
    }

    try {
      await fs.promises.appendFile(arquivo, dataToAppend);

      if (process.env.ONPEC == 'DEV') console.log('BKP DATA - Dados adicionados ao arquivo:', arquivo);
      return;

    } catch (error) {
      throw new Error('BKP DATA - Erro ao gravar os dados: ' + error.message);
    }
  }
}

module.exports = BKP;
