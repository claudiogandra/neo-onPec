const os = require('os');

const userData = async () => {
  return {
    dispositivo: `${os.hostname()}`,
    usuario: `${os.userInfo().username}`,
    modulo: 'ON PEC',
  };
}

module.exports = userData;
