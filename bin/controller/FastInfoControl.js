require("dotenv").config();
const term = require("../util/terminal");
const GadoEventos = require("../model/GadoEventosModel");
const Gado = require("../model/GadoModel");
const { Op } = require("sequelize");

const API_URL = (process.env.ONPEC == 'LOCAL')
? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

const FastInfoControl = {
  async mainBanner() {
    try {
      const result = [
        {
          title: 'Total Cabeças',
          description: await Gado.count({
            where: {
              fase: {
                [Op.not]: null,
                [Op.ne]: 'A'
              }
            }
          })
        },
        {
          title: 'Pesagens Hoje',
          description: await GadoEventos.count({
            where: {
              peso: {
                [Op.not]: null,
              },
              data: new Date(new Date().setHours(0, 0, 0, 0))
            },
          })
        },
        {
          title: 'Embarcados Hoje',
          description: await GadoEventos.count({
            where: {
              fase: 'A',
              data: new Date(new Date().setHours(0, 0, 0, 0))
            },
          })
        },
      ]

      return result;

    } catch (error) {
      term(error);
      return false;
    }
  },
}

module.exports = FastInfoControl;
