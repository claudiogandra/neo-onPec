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
      const window = BrowserWindow.getFocusedWindow();
      const result = await sync(window, 'modal', 1)
      window.setProgressBar(1.0);
      return result;

    } catch (error) {
      console.log(error);
      return false;
    }
  });

  ipcMain.handle('nav', async (event, page) => {
    BrowserWindow.getFocusedWindow().loadFile(`./app/${page}/${page}.ejs`);
  });

  ipcMain.handle('fast-info', async () => {
    return await FastInfoControl.mainBanner();
  });

  ipcMain.handle('data:list', async (event, specs) => {
    const { table = false, filters = false } = specs;
    if (table === false) return false;

    const Control = require(`./controller/${table}Control`);

    return await Control.list(
      (filters !== false || Object.prototype.toString.call(filters) !== '[object Object]')
      ? filters : {}
    );
  });

  ipcMain.handle('data:count', async (event, specs) => {
    const { table = false, filters = false } = specs;
    if (table === false) return false;

    const Control = require(`./controller/${table}Control`);

    return await Control.count(
      (filters !== false || Object.prototype.toString.call(filters) !== '[object Object]')
      ? filters : {}
    );
  });
  
  ipcMain.handle('gado-eventos:list', async (event, brinco) => {
    return await GadoEventosControl.findOne(brinco);
  });

  ipcMain.handle('main-banner:block-items', () => {
    return blockItems;
  });
}

module.exports = { handler };
