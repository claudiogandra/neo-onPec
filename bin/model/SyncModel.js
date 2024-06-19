const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const Sync = sequelize.define('sync', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  dispositivo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  modulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  detalhes: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
},
{
  freezeTableName: true,
  updatedAt: false,
});

Sync.getLastCreatedAt = async () => {
  try {
    const result = await Sync.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'lastCreatedAt']],
    });

    return result.dataValues.lastCreatedAt;

  } catch (error) {
    term(error); // Criar método de arquivo de erros 'logDBerrors'
    throw new Error('Erro ao buscar os dados: ' + error.message);
  }
};

module.exports = Sync;
