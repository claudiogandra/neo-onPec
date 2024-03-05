const { ipcMain, nativeTheme } = require("electron/main");

const calls = () => {
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
  
  ipcMain.handle('ping', async () => 'pong');
}

module.exports = { calls };
