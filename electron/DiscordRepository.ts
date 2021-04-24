import * as Discord from 'discord.js';
import fetch from 'node-fetch';

const BASE_URL = 'https://discord.com/api';

export class DiscordRepository {
  static shared: DiscordRepository;

  static async setupWithToken(token: string) {
    const client = new Discord.Client()
    await client.login(token);
    this.shared = new DiscordRepository(client, token);
  }

  private client: Discord.Client;
  private token: string;

  constructor(client: Discord.Client, token: string) {
    this.client = client;
    this.token = token;
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
    const channel = guild.channels.valueOf().find((channel) => channel.id === channelId);
    const members = channel?.members?.array() ?? [];

    return members.map(member => {
      return {
        id: member.id,
        name: member.displayName,
        icon: member.user.avatarURL() ?? ''
      };
    }) ?? [];
  }

  async setMemberStatus(guildId: string, state: MuteState) {
    return fetch(`${BASE_URL}/guilds/${guildId}/members/${state.memberId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mute: state.mute, deaf: state.deaf })
    });
  }

  async setMemberStatuses(guildId: string, nextMemberStatus: MuteState[]) {
    return Promise.all(nextMemberStatus.map((state) => {
      return this.setMemberStatus(guildId, state);
    }));
  }
}