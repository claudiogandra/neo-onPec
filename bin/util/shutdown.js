const sequelize = require("../db/db");
const term = require("./terminal");

const shutdown = async () => {
  try {
    term('MAIN DESTROY');
    await sequelize.close();
    
  } catch (error) {
    term(`SequelizeClose:\n${error}`)
  }
}

module.exports = { shutdown };
