const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const Sync = sequelize.define('tst_sync', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  dispositivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
{
  frezzeTableName: true,
  updatedAt: false,
});

Sync.getLastCreatedAt = async () => {
  try {
    return await this.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'lastCreatedAt']],
    }).getDataValue('lastCreatedAt');

  } catch (error) {
    term(error); // Criar método de arquivo de erros 'logDBerrors'
    throw new Error('Erro ao buscar os dados: ' + error.message);
  }
}

module.exports = Sync;
