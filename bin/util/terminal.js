require('dotenv').config();

const term = (msg) => {
  if (process.env.ONPEC == 'DEV') console.log(msg);
}

module.exports = term;
