const { get_private_ip, get_public_ip } = require('network');
const os = require('os');
const term = require('./terminal');

const internalIP = async () => {
  return new Promise((resolve) => {
    get_private_ip((err, ip) => {
      if (err) {
        term(err);
        resolve(false);
      } else {
        resolve(ip);
      }
    });
  });
}

const externalIP = async () => {
  return new Promise((resolve) => {
    get_public_ip((err, ip) => {
      if (err) {
        term(err);
        resolve(false);
      } else {
        resolve(ip);
      }
    });
  });
}

const getUnidade = async () => {
  const ip = `${await internalIP()}`;
  term(ip);

  switch (true) {
    case ip.includes('192.168.0.'):
      return 3;

    case ip.includes('192.168.2.'):
      return 21;

    case ip.includes('192.168.3.'):
      return 24;
    
    case ip.includes('192.168.5.') || ip.includes('192.168.99.'):
      return 41;
    
    case ip.includes('192.168.6.'):
      return 1;

    default:
      return false;
  }
}

const userData = async () => {

  const unidade = await getUnidade();

  return {
    dispositivo: `${os.hostname()}`,
    usuario: `${os.userInfo().username}`,
    app: 'ON PEC',
    app: 'GERAL',
    unidade: unidade,
  };
}

module.exports = userData, getUnidade;
