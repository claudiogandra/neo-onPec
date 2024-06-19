const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const GadoEventosQueued = sequelize.define('gado_eventos_queue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
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
GadoEventosQueued.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoEventosQueued.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    term('Erro ao excluir registros da gado_eventos_queue:', error);
    throw error;
  }
};

module.exports = GadoEventosQueued;
