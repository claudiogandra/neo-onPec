const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const User = sequelize.define('user', {
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  darkmode: {
    type: DataTypes.STRING,
    allowNull: false,
    default: true,
  },
},
{
  freezeTableName: true,
});

User.getLastCreatedAt = async () => {
  try {
    const result = await User.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'lastCreatedAt']],
    });

    return result.dataValues.lastCreatedAt;

  } catch (error) {
    term(error); // Criar método de arquivo de erros 'logDBerrors'
    throw new Error('Erro ao buscar os dados: ' + error.message);
  }
};

module.exports = User;
