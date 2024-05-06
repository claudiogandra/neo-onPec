const term = require("../util/terminal");

const renderProcess = async (window, target, obj) => {
  try {
    term(obj.msg);
    await window.send(target, obj);
    return;
    
  } catch (error) {
    term(`RenderProcess:\n${error}`);
  }
}

module.exports = renderProcess;
