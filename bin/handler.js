const { BrowserWindow, ipcMain, nativeTheme } = require("electron");
const { sync } = require("./api/sync");
const { blockItems } = require("./components/main-banner");
const GadoEventosControl = require("./controller/GadoEventosControl");
const FastInfoControl = require("./controller/FastInfoControl");

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
      return await sync(BrowserWindow.getFocusedWindow(), 'modal', 1);

    } catch (error) {
      console.log(error);
      return false;
    }
  });

  ipcMain.handle('nav', async (event, page) => {
    BrowserWindow.getFocusedWindow().loadFile(`./app/${page}/${page}.ejs`);
  });

  ipcMain.handle('main-banner:fast-info', async () => {
    return await FastInfoControl.mainBanner();
  });

  ipcMain.handle('data:count', async (specs) => {
    const { table = false, filters = false } = specs;
    const Control = require(`./controller/${table}Control`);

    return await Control.count(filters);
  });
  
  ipcMain.handle('gadoPesagem:list', async (event, brinco) => {
    return await GadoEventosControl.findOne(brinco);
  });

  ipcMain.handle('main-banner:block-items', () => {
    return blockItems;
  });
}

module.exports = { handler };
