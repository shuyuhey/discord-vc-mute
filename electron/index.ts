import { app, BrowserWindow, ipcMain } from 'electron';
import { DiscordRepository } from "./utils/DiscordRepository";
import { GameMasterBot } from "./utils/GameMasterBot";

let bot: GameMasterBot | null = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 320,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    }
  })

  win.loadFile(`${__dirname}/../index.html`);
  // win.loadURL('http://0.0.0.0:3035/');

  win.on('ready-to-show', () => {
    win.webContents.send('UPDATE_MODE', bot ? 'GAME' : 'SETTING');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

ipcMain.handle('RESET_SETTING', (e) => {
  bot = null;
  e.sender.send('UPDATE_MODE', 'SETTING');
  return;
});

ipcMain.handle('REQUEST_FETCH_GUILD', (e, arg) => {
  DiscordRepository.shared().then((repository) => {
    return repository.fetchGuilds();
  }).then((guilds) => {
    e.sender.send('COMPLETE_FETCH_GUILDS', guilds);
  });

  return;
})

ipcMain.handle('REQUEST_FETCH_CHANNELS', (e, arg: { guildId: string }) => {
  DiscordRepository.shared().then((repository) => {
    return repository.fetchVoiceChannels(arg.guildId);
  }).then((channels) => {
    e.sender.send('COMPLETE_FETCH_CHANNELS', channels);
  });

  return;
})

ipcMain.handle('COMPLETE_STANDBY', (e, arg: { guildId: string, channelId: string }) => {
  DiscordRepository.shared().then((repository) => {
    return Promise.all([
      Promise.resolve(repository),
      repository.fetchChannelMembers(arg.guildId, arg.channelId)
    ]);
  }).then(([repository, members]) => {
    bot = new GameMasterBot(arg.guildId,
      arg.channelId,
      repository);
    e.sender.send('START_GAME')
  });
});

ipcMain.handle('REQUEST_FETCH_GAME', (e, arg) => {
  e.sender.send('UPDATE_GAME', bot?.gameInfo);
});

ipcMain.handle('REQUEST_SYNC_MEMBER', (e) => {
  bot?.syncCurrentChannelMembers();
  e.sender.send('UPDATE_GAME', bot?.gameInfo);
});

ipcMain.handle('START_PLAY', (e) => {
  return bot?.startPlay().then(() => {
    e.sender.send('UPDATE_GAME', bot?.gameInfo);
  });
});

ipcMain.handle('FINISH_PLAY', (e) => {
  return bot?.finishPlay().then(() => {
    e.sender.send('UPDATE_GAME', bot?.gameInfo);
  });
});

ipcMain.handle('START_MEETING', (e) => {
  return bot?.makeDiscussionMode().then(() => {
    e.sender.send('UPDATE_GAME', bot?.gameInfo);
  });
});

ipcMain.handle('FINISH_MEETING', (e) => {
  return bot?.makePlayMode().then(() => {
    e.sender.send('UPDATE_GAME', bot?.gameInfo);
  });
});

ipcMain.handle('SET_DIED', (e, arg: { memberId: string, isDied: boolean }) => {
  bot?.setDied(arg.memberId, arg.isDied);
  e.sender.send('UPDATE_GAME', bot?.gameInfo);
});