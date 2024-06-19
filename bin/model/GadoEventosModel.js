const sequelize = require('../db/db');
const { DataTypes, Op } = require('sequelize');
const term = require('../util/terminal');

const GadoEventos = sequelize.define('gado_eventos', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  brinco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  lote: {
    type: DataTypes.STRING,
  },
  pasto: {
    type: DataTypes.STRING,
  },
  peso: {
    type: DataTypes.DOUBLE,
  },
  fase: {
    type: DataTypes.STRING(1),
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

GadoEventos.getLastData = async (paramDate, logging) => {
  try {
    return await GadoEventos.findAll({
      where: {
        data: {
          [Op.gte]: paramDate,
        },
      },
    });
    
  } catch (error) {
    term(error); // Criar método de arquivo de erros 'logDBerrors'
    throw new Error('GADO EVENTOS - Erro ao buscar os dados: ' + error.message);
  }
};

module.exports = GadoEventos;
