const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const GadoRaca = sequelize.define('gado_raca', {
  sigla: {
    type: DataTypes.STRING(3),
    primaryKey: true,
    allowNull: false,
  },
  raca: {
    type: DataTypes.STRING(30),
    autoIncrement: false,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  freezeTableName: true,
  updatedAt: false,
});

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
GadoRaca.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoRaca.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    term('Erro ao excluir registros da gado_raca:', error);
    throw error;
  }
};

module.exports = GadoRaca;
