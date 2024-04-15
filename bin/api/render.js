const term = require("../resources/terminal");

const renderProcess = async (window, target, msg) => {
  term(msg);
  await window.webContents.send(target, msg);
  return;
}

module.exports = renderProcess;
