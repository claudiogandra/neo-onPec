require("dotenv").config();
const sequelize = require('../data/db');
const { DataTypes } = require('sequelize');

const GadoPesagem = sequelize.define('tst_gado_pesagem', {
  id: {
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  brinco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lote: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pasto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  peso: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  fase: {
    type: DataTypes.STRING(1),
    allowNull: true,
  },
}, {
  indexes: [
    {
      name: 'un_brinco_data',
      unique: true,
      fields: ['brinco', 'data'],
    }
  ],
  freezeTableName: true,
});

GadoPesagem.getLastData = async (paramDate, logging) => {
  try {
    return await this.findAll({
      where: {
        data: {
          [Op.gte]: paramDate,
        },
      },
    });
    
  } catch (error) {
    if (process.env.ONPEC == 'DEV') console.log(error); // Criar método de arquivo de erros 'logDBerrors'
    throw new Error('GADO PESAGEM - Erro ao buscar os dados: ' + error.message);
  }
};

module.exports = GadoPesagem;
