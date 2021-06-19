import * as electron from 'electron';
import { app, BrowserWindow, ipcMain } from 'electron';
import { DiscordWorker, DiscordWorkerInterface } from "./worker/DiscordWorker";
import { GameState } from "./GameState";
import * as path from "path";
import ElectronStore from "electron-store";
import { MockedDiscordWorker } from "./worker/MockedDiscordWorker";

if (!app.isPackaged) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit'
  });
}

let state: GameState | null = null;
let worker: DiscordWorkerInterface;
const store = new ElectronStore();

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    }
  })

  win.on('ready-to-show', () => {
    if (process.env.MOCK_MODE) {
      worker = new MockedDiscordWorker();
      win.webContents.send('UPDATE_MODE', state ? 'GAME' : 'SETTING');
      return;
    }

    const token = store.get('token');
    if (token) {
      worker = new DiscordWorker(String(token), () => {
        win.webContents.send('UPDATE_MODE', state ? 'GAME' : 'SETTING');
      });
    } else {
      win.webContents.send('UPDATE_MODE', 'TOKEN');
    }
  });

  if (!app.isPackaged) {
    win.loadURL('http://0.0.0.0:3035/');
    win.webContents?.openDevTools();
  } else {
    win.loadFile(`${__dirname}/../index.html`);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
})

app.on('will-quit', () => {
  worker?.terminate();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

ipcMain.handle('FETCH_BOT_TOKEN', (e, arg) => {
  return store.get('token');
});

ipcMain.handle('SET_BOT_TOKEN', (e, arg: { token: string }) => {
  store.set('token', arg.token);

  worker?.terminate();
  worker = new DiscordWorker(String(arg.token), () => {
    e.sender.send('UPDATE_MODE', 'SETTING');
  });
});

ipcMain.handle('RESET_TOKEN', (e) => {
  e.sender.send('UPDATE_MODE', 'TOKEN');
  return;
});

ipcMain.handle('RESET_SETTING', (e) => {
  state = null;
  e.sender.send('UPDATE_MODE', 'SETTING');
  return;
});

ipcMain.handle('REQUEST_FETCH_GUILD', (e, arg) => {
  return worker.fetchGuilds();
})

ipcMain.handle('REQUEST_FETCH_CHANNELS', async (e, arg: { guildId: string }) => {
  await worker.selectGuild(arg.guildId);
  return worker.fetchVoiceChannels();
})

ipcMain.handle('COMPLETE_STANDBY', async (e, arg: { channelId: string }) => {
  await worker.selectChannel(arg.channelId)

  state = new GameState();
  e.sender.send('START_GAME');
  return;
});

ipcMain.handle('REQUEST_FETCH_GAME', (e, arg) => {
  e.sender.send('UPDATE_GAME', state?.gameInfo);
  return state?.gameInfo;
});

ipcMain.handle('REQUEST_SYNC_MEMBER', (e) => {
  const members = worker.fetchChannelMembers();
  state?.syncCurrentChannelMembers(members);
  e.sender.send('UPDATE_GAME', state?.gameInfo);
  return state?.gameInfo;
});

ipcMain.handle('START_PLAY', (e) => {
  if (!state) {
    return;
  }
  state.startPlay();
  worker?.setAllMemberStatus(state.currentMuteStatus)
  return state.gameInfo;
});

ipcMain.handle('FINISH_PLAY', (e) => {
  if (!state) {
    return;
  }
  state?.finishPlay();
  worker?.setAllMemberStatus(state.currentMuteStatus)
  return state?.gameInfo;
});

ipcMain.handle('START_MEETING', (e) => {
  if (!state) {
    return;
  }
  state?.makeDiscussionMode();
  worker?.setAllMemberStatus(state.currentMuteStatus)
  return state?.gameInfo;
});

ipcMain.handle('FINISH_MEETING', (e) => {
  if (!state) {
    return;
  }
  state?.makePlayMode();
  worker?.setAllMemberStatus(state.currentMuteStatus)
  return state?.gameInfo;
});

ipcMain.handle('SET_DIED', (e, arg: { memberId: string, isDied: boolean }) => {
  if (!state) {
    return;
  }
  const member = state?.setDied(arg.memberId, arg.isDied);
  if (member) {
    worker?.setMemberStatus(member);
  }
  return state.gameInfo;
});

ipcMain.handle('SET_DIED_WITHOUT_UPDATE', (e, arg: { memberId: string, isDied: boolean }) => {
  state?.setDied(arg.memberId, arg.isDied);
  return state?.gameInfo;
});