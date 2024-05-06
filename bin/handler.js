const { BrowserWindow, ipcMain, nativeTheme } = require("electron");
const GadoPesagemControl = require("./controller/GadoPesagemControl");

const handler = () => {
  ipcMain.handle('dark-mode:toggle', async () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }

    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('sync', async () => {
    try {
      return await sync(BrowserWindow.getFocusedWindow());

    } catch (error) {
      console.log(error);
      return false;
    }
  });

  ipcMain.handle('nav', async (event, page) => {
    BrowserWindow.getFocusedWindow().loadFile(`../app/${page}/${page}.ejs`);
  });

  ipcMain.handle('gadoPesagem:list', async (event, brinco) => {
    return await GadoPesagemControl.findOne(brinco);
  });
}

module.exports = { handler };
