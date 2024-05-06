const GadoPesagemControl = require("../controller/GadoPesagemControl");
const SyncControl = require("../controller/SyncControl");
const term = require("../util/terminal");

const DataPending = {
  async check() {
    try {
      // Ultima data de sincronizacao
      const mostRecentDate = await SyncControl.mostRecentDate();
      term(`MOST RECENT: ${mostRecentDate}`);

      // Baixar dados de pesagem a partir da ultima data de sincronizacao
      const response = await GadoPesagemControl.push(mostRecentDate);

      term(`IMPORT: ${response}`);
      return response;

    } catch (error) {
      term(error);
      throw error;
    }
  },

  async upload(tables) {
    for (const table of tables) {
      
    }
  }
}

module.exports = DataPending;
