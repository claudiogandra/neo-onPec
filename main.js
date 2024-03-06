require('dotenv').config();
const { app } = require('electron');
const { updateElectronApp } = require('update-electron-app');
const handleSquirrelEvent = require('./bin/squirrel');
const { mainWin, currentWin } = require('./bin/bw');
const { calls } = require('./bin/handles');

if (require('electron-squirrel-startup')) return;

updateElectronApp({
  updateInterval: '24 hour',
  logger: require('electron-log')
});

calls();

app.whenReady().then(async () => {
  await mainWin();

  app.on('activate', async () => {
    if (currentWin) {
      await mainWin();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

if (handleSquirrelEvent(app)) {
  // Não executar nada além
  return;
}
