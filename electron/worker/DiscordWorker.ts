import Discord, { Snowflake } from 'discord.js';
import { app } from 'electron';

export interface DiscordWorkerInterface {
  fetchGuilds(): Guild[];

  selectGuild(guildId: Snowflake): Promise<void>;

  fetchVoiceChannels(): Channel[];

  selectChannel(channelId: Snowflake): Promise<void>;

  fetchChannelMembers(): Member[];

  setMemberStatus(state: MuteState): Promise<void>;

  setAllMemberStatus(nextMemberStatus: MuteState[]): Promise<void>;
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
    await this.players.map(p => p.edit({ deaf: state.deaf, mute: state.mute }));
    return;
  }

  async setAllMemberStatus(nextMemberStatus: MuteState[]): Promise<void> {
    await Promise.all(nextMemberStatus.map((state) => {
      return this.setMemberStatus(state);
    }));

    return;
  }
}