const { BrowserWindow, nativeTheme } = require('electron');
const path = require('node:path');

const mainWin = () => {
  // Criar janela de navegacao
  nativeTheme.themeSource = 'dark';
  const win = new BrowserWindow({
    width: 1200,
    minWidth: 480,
    height: 600,
    minHeight: 500,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'preIndex.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      devTools: true
    }
  });

  win.setIcon(path.join(__dirname, 'Wlogo.ico'));

  if (process.env.ONPEC == 'DEV') console.log('INDEX CONFIG');
  
  return win;
};

const introWin = () => {
  // Criar janela de navegacao
  const win = new BrowserWindow({
    width: 300,
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
      enableRemoteModule: true,
      devTools: true
    }
  });

  win.setIcon(path.join(__dirname, 'Wlogo.ico'));
  
  if (process.env.ONPEC == 'DEV') console.log('INTRO CONFIG');

  return win;
};

const currentWin = () => BrowserWindow.getAllWindows().length === 0;

module.exports = { mainWin, introWin, currentWin };
