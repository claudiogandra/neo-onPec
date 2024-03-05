require('dotenv').config();
const { app } = require('electron');
//const { updateElectronApp, UpdateSourceType } = require('update-electron-app');
const { mainWin, currentWin } = require('./bin/bw');
const { calls } = require('./bin/handles');
const handleSquirrelEvent = require('./bin/squirrel');

calls();

// Checar Atualizações
/* updateElectronApp({
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: `${process.env.REPO}`
  },
  updateInterval: '1 hour',
  logger: require('electron-log')
}) */

if (require('electron-squirrel-startup')) return;
if (handleSquirrelEvent(app)) {
  // Não executar nada além
  return;
}

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
