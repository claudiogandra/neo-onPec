require('dotenv').config();
const Sequelize = require('sequelize');
const path = require('path');

const db = (process.env.ONPEC == 'DEV')
  ? path.join(__dirname, '../data/local.test.db')
  : path.join(__dirname, '../data/local.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: db,
  pool: {
    max: 20,
  },
  logging: false
});
 
module.exports = sequelize;
