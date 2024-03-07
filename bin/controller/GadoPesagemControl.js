const GadoPesagem = require("../model/GadoPesagemModel");

require("dotenv").config();

const GadoPesagemControl = {
  async findAll() {
    try {
      return await GadoPesagem.findAll({ order: [ ['data', 'DESC'] ] });

    } catch (error) {
      if (process.env.ONPEC == 'DEV') console.log(error); // Criar método de arquivo de erros 'logDBerrors'
      throw new Error('GADO PESAGEM - Erro ao buscar os dados: ' + error.message);
    }
  },
}

module.exports = GadoPesagemControl;
