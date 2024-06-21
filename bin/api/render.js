const term = require("../util/terminal");

const renderProcess = async (window, proc, obj) => {
  try {
    term(obj.msg);
    await window.send(proc, obj);
    return;
    
  } catch (error) {
    term(`RenderProcess:\n${error}`);
  }
}

module.exports = renderProcess;
