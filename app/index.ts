import { app, BrowserWindow, ipcMain } from 'electron';
import { DiscordRepository } from "./utils/DiscordRepository";
import { GameMasterBot } from "./utils/GameMasterBot";

const gameInfo: {
  guildId: string | null,
  meetingChannelId: string | null,
  diedChannelId: string | null
} = {
  guildId: null,
  meetingChannelId: null,
  diedChannelId: null
}

let bot: GameMasterBot | null = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    }
  })

  win.loadFile('./index.html');
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('REQUEST_FETCH_GUILD', (e, arg) => {
  DiscordRepository.shared().then((repository) => {
    return repository.fetchGuilds();
  }).then((guilds) => {
    e.sender.send('COMPLETE_FETCH_GUILDS', guilds);
  });

  return;
})

ipcMain.handle('SELECT_GUILD', (e, arg: { guildId: string }) => {
  DiscordRepository.shared().then((repository) => {
    return repository.fetchVoiceChannels(arg.guildId);
  }).then((channels) => {
    gameInfo.guildId = arg.guildId
    e.sender.send('COMPLETE_FETCH_CHANNELS', channels);
  });

  return;
})

ipcMain.handle('SELECT_CHANNEL', (e, arg: { meetingId: string, diedId: string }) => {
  DiscordRepository.shared().then((repository) => {
    return repository.fetchGuildMembers(gameInfo.guildId ?? '', arg.meetingId);
  }).then((members) => {
    gameInfo.meetingChannelId = arg.meetingId;
    gameInfo.diedChannelId = arg.diedId;
    e.sender.send('COMPLETE_FETCH_MEMBERS', members);
  });

  return;
})

ipcMain.handle('COMPLETE_STANDBY', (e, arg) => {
  DiscordRepository.shared().then((repository) => {
    return Promise.all([
      Promise.resolve(repository),
      repository.fetchGuildMembers(gameInfo.guildId ?? '', gameInfo.meetingChannelId ?? '')
    ]);
  }).then(([repository, members]) => {
    bot = new GameMasterBot(gameInfo.guildId ?? '',
      gameInfo.meetingChannelId ?? '',
      gameInfo.diedChannelId ?? '',
      members,
      repository);
    e.sender.send('START_GAME')
  });
});

ipcMain.handle('REQUEST_FETCH_GAME', (e, arg) => {
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