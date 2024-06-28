require("dotenv").config();
const term = require("../util/terminal");
const renderProcess = require("../api/render");
const GadoEventos = require("../model/GadoEventosModel");
const StreamData = require("../util/stream");
const sequelize = require("../db/db");
const { Op } = require("sequelize");

const API_URL = (process.env.ONPEC == 'LOCAL')
? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

const GadoEventosControl = {
  async count(filters = {}) {
    try {
      const response = await Gado.count(filters);
      return response;
      
    } catch (error) {
      term(error);
      return false;
    }
  },
  
  async list(filters = {}) {
    try {
      if (filters.hasOwnProperty('peso')) {
        if (filters.peso === true) {
          filters.peso = { [Op.not]: null };
          
        } else {
          delete filters.peso;
        }
      }

      return await GadoEventos.findAll({
        where: filters,
        order: [ ['data', 'DESC'] ]
      });
      
    } catch (error) {
      if (process.env.ONPEC == 'DEV') console.log(error); // Criar método de arquivo de erros 'logDBerrors'
      throw new Error('GADO EVENTOS FIND ALL - Erro ao buscar os dados: ' + error.message);
    }
  },
  
  async findOne(brinco) {
    try {
      return await GadoEventos.findOne({ where: { brinco } });
      
    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  },
  
  async push(mostRecentDate = false) {
    term('Data mais recente: ', mostRecentDate)
    try {
      const response = await fetch(`${API_URL}/api/gadoeventos/push`, {
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
      
      term('Baixando dados de Gado Eventos');
      return data;
      
    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      return false;
    }
  },
  
  async import(data, window, proc, step) {
    let transaction;
    let count = 0;
    
    try {
      transaction = await sequelize.transaction();
      const up = (data.upsert).length ? (data.upsert).length : 0
      const del = (data.destroy).length ? (data.destroy).length : 0
      const total = up + del;
      
      renderProcess(
        window,
        proc,
        {
          step: `Passo ${step}\n\n- Tabela Gado Eventos`,
          msg: `Sincronizados: ${count} | Total: ${total}`
        }
      );
      
      if (up > 0) {
        for (const item of data.upsert) {
          /* result = await GadoEventos.findOne({
            where: { brinco: item.brinco, data: `${item.data}` }
            });
            
            const [reponse, created] = (result)
            ? await GadoEventos.update(item, {
              where: { 
                brinco: result.brinco,
                data: result.data
                },
                transaction,
                })
                : */ await GadoEventos.upsert(item, {
                  where: { 
                    brinco: item.brinco,
                    data: item.data
                  },
                  transaction,
                });
                
                count++;
                
                if (count % 1000 === 0 || count === total) {
                  await transaction.commit(); // Faz commit da transacao atual a cada X iteracoes
                  transaction = await sequelize.transaction(); // Inicia uma nova transacao
            
                  renderProcess(
                    window,
                    proc,
                    {
                      msg: `Sincronizados: ${count} | Total: ${total}`
                    }
                  );
                }
              }
            }
            
            if (del > 0) {
              for (const item of data.destroy) {
                await GadoEventos.destroy({
                  where: {
                    id: item.id,
                    brinco: item.brinco,
                    data: item.data
                  },
                  transaction,
                });
                
          count++;
          if (count % 1000 === 0 || count === total) {
            await transaction.commit(); // Faz commit da transacao atual a cada X iteracoes
            transaction = await sequelize.transaction(); // Inicia uma nova transacao
          }
          
          renderProcess(
            window,
            proc,
            {
              msg: `Sincronizados: ${count} | Total: ${total}`
            }
          );
        }
      }
      
      return true;
      
    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      await transaction.rollback();
      throw error;
    }
  },
}

module.exports = GadoEventosControl;
