import Discord, { Snowflake } from 'discord.js';
import { app } from 'electron';
import { diffMuteState } from "../lib/diffMuteState";

export interface DiscordWorkerInterface {
  fetchGuilds(): Guild[];

  selectGuild(guildId: Snowflake): Promise<void>;

  fetchVoiceChannels(): Channel[];

  selectChannel(channelId: Snowflake): Promise<void>;

  fetchChannelMembers(): Member[];

  setMemberStatus(state: MuteState): Promise<void>;

  setAllMemberStatus(nextMemberStatus: MuteState[]): Promise<void>;

  terminate(): void;
}

export class DiscordWorker implements DiscordWorkerInterface {
  private readonly client: Discord.Client;
  private readonly token: string;

  private guild?: Discord.Guild;
  private playChannel?: Discord.GuildChannel;
  private players: Discord.GuildMember[] = [];

  constructor(token: string, onReady: Function) {
    this.token = token;
    this.client = new Discord.Client();

    if (!app.isPackaged) {
      this.client.on('debug', (log) => console.log('[DEBUG]', log));
      this.client.on('warn', (log) => console.log('[WARN ]', log));
    }

    this.client.on('ready', () => {
      onReady();
    });

    this.client.login(token);
  }

  fetchGuilds(): Guild[] {
    return this.client.guilds.cache.array().map(g => ({ id: g.id, name: g.name }))
  }

  async selectGuild(guildId: Snowflake) {
    this.guild = await this.client.guilds.fetch(guildId);
    this.playChannel = undefined;
    this.players = [];
  }

  fetchVoiceChannels(): Channel[] {
    if (!this.guild) {
      return [];
    }

    return this.guild.channels.cache.filter(c => c.type === 'voice').array()
      .map(c => ({ id: c.id, name: c.name }));
  }

  async selectChannel(channelId: Snowflake) {
    if (!this.guild) {
      return;
    }

    this.players = [];
    this.playChannel = await this.guild?.channels.cache.find(channel => channel.id === channelId);
  }

  fetchChannelMembers(): Member[] {
    this.players = this.playChannel?.members.array() ?? [];

    return this.players.map(member => {
      return {
        id: member.id,
        name: member.displayName,
        icon: member.user.avatarURL() ?? ''
      };
    });
  }

  async setMemberStatus(state: MuteState): Promise<void> {
    const player = this.players.find(p => p.id === state.memberId);
    await player?.edit({ deaf: state.deaf, mute: state.mute });
    return;
  }

  async setAllMemberStatus(nextMemberStatus: MuteState[]): Promise<void> {
    const currentStatus = this.playChannel?.members.array().map(m => ({
      memberId: m.id,
      deaf: m.voice.serverDeaf ?? false,
      mute: m.voice.serverMute ?? false
    })) ?? [];

    const statuses = diffMuteState(currentStatus, nextMemberStatus);

    await Promise.all(statuses.map((state) => {
      return this.setMemberStatus(state);
    }));

    return;
  }

  terminate() {
    this.client.removeAllListeners();
    this.client.destroy();
  }
}