const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const Gado = sequelize.define('gado', {
  brinco: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    autoIncrement: false,
  },
  sexo: {
    type: DataTypes.STRING(1),
    allowNull: false,
  },
  raca: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  lote: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  pasto: {
    type: DataTypes.STRING(20),
    allowNull: true,
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
  freezeTableName: true,
});

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
Gado.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await Gado.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    term('Erro ao excluir registros da gado_fase:', error);
    throw error;
  }
};

module.exports = Gado;
