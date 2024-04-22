const sequelize = require("../db/db");
const term = require("../util/terminal");

const shutdown = async () => {
  try {
    await sequelize.close();
    
  } catch (error) {
    term(`SequelizeClose:\n${error}`)
  }
}

module.exports = { shutdown };
