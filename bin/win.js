const { BrowserWindow, nativeTheme } = require('electron');
const path = require('node:path');
const term = require('./util/terminal');

const Win = {
  main() {
    // Criar janela de navegacao
    nativeTheme.themeSource = 'dark';
    const bw = new BrowserWindow({
      width: 1200,
      minWidth: 600,
      height: 720,
      minHeight: 500,
      autoHideMenuBar: true,
      resizable: true,
      show: false,
      webPreferences: {
        sandbox: false,
        preload: path.join(__dirname, 'preIndex.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: false,
        devTools: (process.env.ONPEC == 'DEV') ? true : false,
      }
    });

    bw.setIcon(path.join(__dirname, 'logo.ico'));

    term('MAIN CONFIG');
    
    return bw;
  },

  intro() {
    // Criar janela de navegacao
    const bw = new BrowserWindow({
      width: 460,
      minHeight: 500,
      transparent: true,
      autoHideMenuBar: true,
      show: false,
      frame: false,
      resizable: false,
      alwaysOnTop: true,
      webPreferences: {
        sandbox: false,
        preload: path.join(__dirname, 'preIntro.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: false,
        devTools: (process.env.ONPEC == 'DEV') ? true : false,
      }
    });

    bw.setIcon(path.join(__dirname, 'Wlogo.ico'));
    
    term('INTRO CONFIG');

    return bw;
  },

  current() {
    return BrowserWindow.getAllWindows().length === 0;
  }
}

module.exports = { Win };
