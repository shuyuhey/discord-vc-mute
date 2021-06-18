import Discord from 'discord.js';
import fetch from 'node-fetch';
import { app } from 'electron';

const BASE_URL = 'https://discord.com/api';

export interface DiscordRepositoryInterface {
  fetchGuilds(): Promise<Guild[]>;
  fetchVoiceChannels(guildId: string): Promise<Channel[]>;
  fetchChannelMembers(guildId: string, channelId: string): Promise<Member[]>;
  setMemberStatus(guildId: string, state: MuteState): Promise<void>;
  setMemberStatuses(guildId: string, nextMemberStatus: MuteState[]): Promise<void>;
}

console.log('loading classes');

export class DiscordRepository implements DiscordRepositoryInterface {
  private readonly client: Discord.Client;
  private readonly token: string;

  constructor(token: string, onReady: Function) {
    this.token = token;
    this.client = new Discord.Client();

    this.client.on('[debug]', console.log);
    this.client.login(token).then(() => {
      onReady();
    });
  }

  fetchGuilds(): Promise<Guild[]> {
    return fetch(`${BASE_URL}/users/@me/guilds`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${this.token}`
      }
    }).then(r => r.json());
  }

  async fetchVoiceChannels(guildId: string): Promise<Channel[]> {
    return fetch(`${BASE_URL}/guilds/${guildId}/channels`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${this.token}`
      }
    }).then(r => r.json())
      .then(r => r as ChannelResponse[])
      .then(channels => channels.filter(channel => channel.type === 2));
  }

  async fetchChannelMembers(guildId: string, channelId: string): Promise<Member[]> {
    const guild = await this.client.guilds.fetch(guildId, true);
    const channel = guild.channels.cache.find((channel) => channel.id === channelId);
    const members = channel?.members.array() ?? [];

    return members.map(member => {
      return {
        id: member.id,
        name: member.displayName,
        icon: member.user.avatarURL() ?? ''
      };
    }) ?? [];
  }

  async setMemberStatus(guildId: string, state: MuteState): Promise<void> {
    return fetch(`${BASE_URL}/guilds/${guildId}/members/${state.memberId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mute: state.mute, deaf: state.deaf })
    }).then(r => {
      if (!app.isPackaged) {
        console.log(r.headers);
      }
      if (r.status === 429) {
        const resetAfter = Number(r.headers.get('x-ratelimit-reset-after')) * 1000.0;
        return new Promise((resolve) => {
          setTimeout(async () => {
            await this.setMemberStatus(guildId, state);
            resolve();
          }, resetAfter);
        })
      }
      return Promise.resolve();
    });
  }

  async setMemberStatuses(guildId: string, nextMemberStatus: MuteState[]): Promise<void> {
    return Promise.all(nextMemberStatus.map((state) => {
      return this.setMemberStatus(guildId, state);
    })).then(() => { return; });
  }
}