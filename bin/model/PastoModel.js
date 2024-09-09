const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const PastoModel = sequelize.define('pasto', {
  pasto: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    autoIncrement: false,
  },
  unidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ciclo: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'A'
  },
}, {
  freezeTableName: true,
  createdAt: false,
});

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
PastoModel.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await PastoModel.destroy({ truncate: true });
    return true;

  } catch (error) {
    term('Erro ao excluir registros da gado_pasto:', error);
    throw error;
  }
};

module.exports = PastoModel;
