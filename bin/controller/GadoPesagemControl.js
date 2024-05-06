require("dotenv").config();
const term = require("../util/terminal");
const renderProcess = require("../api/render");
const GadoPesagem = require("../model/GadoPesagemModel");
const StreamData = require("../util/stream");
const sequelize = require("../db/db");
const API_URL = `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

const GadoPesagemControl = {
  async findAll() {
    try {
      return await GadoPesagem.findAll({ order: [ ['data', 'DESC'] ] });

    } catch (error) {
      if (process.env.ONPEC == 'DEV') console.log(error); // Criar método de arquivo de erros 'logDBerrors'
      throw new Error('GADO PESAGEM FIND ALL - Erro ao buscar os dados: ' + error.message);
    }
  },

  async findOne(brinco) {
    try {
      return await GadoPesagem.findOne({ where: { brinco } });

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  },

  async upload(dataUpload) {
    try {
      const response = await fetch(`${API_URL}/api/gadopesagem/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataUpload)
      });

      if (!response.body) {
        throw new Error('ReadableStream não disponível');
      }

      // Processa a resposta do stream
      const data = await StreamData.read(response.body.getReader());

      term('Enviando dados de GadoPesagem');
      return data;

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  },

  async push(mostRecentDate = false) {
    term('Data mais recente: ', mostRecentDate)
    try {
      const response = await fetch(`${API_URL}/api/gadopesagem/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'mostrecentdate': JSON.stringify(mostRecentDate),
        },
        body: null
      });
  
      if (!response.body) {
        throw new Error('ReadableStream não disponível');
      }

      const data = await StreamData.read(response.body.getReader());
  
      term('Baixando dados de GadoPesagem');
      return data;
  
    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  },

  async import(data, window, proc, step) {
    try {
      let transaction = await sequelize.transaction();
      let count = 0;
      const u = data.upsert ? data.upsert.length : 0;
      const d = data.destroy ? data.destroy.length : 0;

      if (u > 0) {
        for (const item of data.upsert) {
          const result = await GadoPesagem.findOne({
            where: { brinco: item.brinco, data: `${item.data}` }
          });

          const [reponse, created] = (result)
            ? await GadoPesagem.update(item, {
              where: { 
                brinco: result.brinco,
                data: result.data
              },
              transaction,
            })
            : await GadoPesagem.upsert(item, {
              where: { 
                brinco: item.brinco,
                data: item.data
              },
              transaction,
            });

          count++;

          if (count % 250 === 0) {
            await transaction.commit(); // Faz commit da transacao atual a cada X iteracoes
            transaction = await sequelize.transaction(); // Inicia uma nova transacao
          }

          await renderProcess(
            window,
            proc,
            {
              step: step,
              message: `Sincronizando > Gado Pesagem: ${count} de ${u + d}`
            }
          );
        }
      }
      return;

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      throw error;
    }
  }
}

module.exports = GadoPesagemControl;
