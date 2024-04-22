const fs = require('fs');
const path = require('path');

async function getHeader() {
  return await fs.promises.readFile(path.join(__dirname, '../../app/header/header.html'), 'utf-8');
}

module.exports = { getHeader };
