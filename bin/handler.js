const { BrowserWindow, ipcMain, nativeTheme } = require("electron");

const handler = () => {
  ipcMain.handle('dark-mode:toggle', async () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }

    return nativeTheme.shouldUseDarkColors;
  });
  
  ipcMain.handle('dark-mode:system', async () => {
    nativeTheme.themeSource = 'system';
  });

  ipcMain.handle('sync', async () => {
    try {
      return await sync(BrowserWindow.getFocusedWindow());

    } catch (error) {
      return false;
    }
  });
  
  ipcMain.handle('ping', async () => 'pong');
}

module.exports = { handler };
