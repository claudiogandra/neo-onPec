require('dotenv').config();

const term = (msg) => {
  if (process.env.ONPEC == 'DEV' || process.env.ONPEC == 'LOCAL') console.log(msg);
}

module.exports = term;
