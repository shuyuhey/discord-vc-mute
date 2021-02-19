import * as electron from 'electron';
import { app, BrowserWindow, ipcMain } from 'electron';
import { DiscordRepository } from "./utils/DiscordRepository";
import { GameMasterBot } from "./utils/GameMasterBot";
import * as path from "path";

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

  if (!app.isPackaged) {
    win.loadURL('http://0.0.0.0:3035/');
    win.webContents?.openDevTools();
  } else {
    win.loadFile(`${__dirname}/../index.html`);
  }

  win.on('ready-to-show', () => {
    win.webContents.send('UPDATE_MODE', bot ? 'GAME' : 'SETTING');
  });

  if (!app.isPackaged) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
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

ipcMain.handle('REQUEST_FETCH_GUILD', async (e, arg) => {
  return await DiscordRepository.shared().then((repository) => {
    return repository.fetchGuilds();
  }).then((guilds) => {
    return guilds;
  });
})

ipcMain.handle('REQUEST_FETCH_CHANNELS', async (e, arg: { guildId: string }) => {
  return await DiscordRepository.shared().then((repository) => {
    return repository.fetchVoiceChannels(arg.guildId);
  }).then((channels) => {
    return channels;
  });
})

ipcMain.handle('COMPLETE_STANDBY', async (e, arg: { guildId: string, channelId: string }) => {
  return await DiscordRepository.shared().then((repository) => {
    return Promise.all([
      Promise.resolve(repository),
      repository.fetchChannelMembers(arg.guildId, arg.channelId)
    ]);
  }).then(([repository, members]) => {
    bot = new GameMasterBot(arg.guildId,
      arg.channelId,
      repository);
    e.sender.send('START_GAME');
    return;
  });
});

ipcMain.handle('REQUEST_FETCH_GAME', (e, arg) => {
  e.sender.send('UPDATE_GAME', bot?.gameInfo);
  return bot?.gameInfo;
});

ipcMain.handle('REQUEST_SYNC_MEMBER', (e) => {
  bot?.syncCurrentChannelMembers();
  e.sender.send('UPDATE_GAME', bot?.gameInfo);
  return bot?.gameInfo;
});

ipcMain.handle('START_PLAY', (e) => {
  return bot?.startPlay().then(() => {
    return bot?.gameInfo;
  });
});

ipcMain.handle('FINISH_PLAY', (e) => {
  return bot?.finishPlay().then(() => {
    return bot?.gameInfo;
  });
});

ipcMain.handle('START_MEETING', (e) => {
  return bot?.makeDiscussionMode().then(() => {
    return bot?.gameInfo;
  });
});

ipcMain.handle('FINISH_MEETING', (e) => {
  return bot?.makePlayMode().then(() => {
    return bot?.gameInfo;
  });
});

ipcMain.handle('SET_DIED', (e, arg: { memberId: string, isDied: boolean }) => {
  return bot?.setDied(arg.memberId, arg.isDied).then(() => {
    return bot?.gameInfo;
  });
});