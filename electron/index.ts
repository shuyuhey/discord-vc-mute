import * as electron from 'electron';
import { app, BrowserWindow, ipcMain } from 'electron';
import { DiscordRepository } from "./DiscordRepository";
import { GameMasterBot } from "./GameMasterBot";
import * as path from "path";
import ElectronStore from "electron-store";

let bot: GameMasterBot | null = null;
const store = new ElectronStore();

function createWindow() {
  const win = new BrowserWindow({
    width: 375,
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
    const token = store.get('token');
    if (token) {
      DiscordRepository.setupWithToken(String(token)).then(() => {
        win.webContents.send('UPDATE_MODE', bot ? 'GAME' : 'SETTING');
      })
        .catch((error) => {
          win.webContents.send('UPDATE_MODE', 'TOKEN');
        });
    } else {
      win.webContents.send('UPDATE_MODE', 'TOKEN');
    }
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

ipcMain.handle('FETCH_BOT_TOKEN', async (e, arg) => {
  return store.get('token');
});

ipcMain.handle('SET_BOT_TOKEN', async (e, arg: { token: string }) => {
  store.set('token', arg.token);
  return DiscordRepository.setupWithToken(arg.token).then(() => {
    e.sender.send('UPDATE_MODE', 'SETTING');
  });
});

ipcMain.handle('RESET_TOKEN', (e) => {
  e.sender.send('UPDATE_MODE', 'TOKEN');
  return;
});

ipcMain.handle('RESET_SETTING', (e) => {
  bot = null;
  e.sender.send('UPDATE_MODE', 'SETTING');
  return;
});

ipcMain.handle('REQUEST_FETCH_GUILD', async (e, arg) => {
  return await DiscordRepository.shared.fetchGuilds()
    .then((guilds) => {
      return guilds;
    });
})

ipcMain.handle('REQUEST_FETCH_CHANNELS', async (e, arg: { guildId: string }) => {
  return await DiscordRepository.shared.fetchVoiceChannels(arg.guildId)
    .then((channels) => {
      return channels;
    });
})

ipcMain.handle('COMPLETE_STANDBY', async (e, arg: { guildId: string, channelId: string }) => {
  const repository = DiscordRepository.shared;

  bot = new GameMasterBot(arg.guildId,
    arg.channelId,
    repository);
  e.sender.send('START_GAME');
  return;
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