import * as Discord from 'discord.js';

require('dotenv').config();

const TOKEN = process.env.TOKEN;

export class DiscordRepository {
  private static _shared: DiscordRepository;

  static async shared() {
    if (!this._shared) {
      const client = new Discord.Client()
      await client.login(TOKEN);
      this._shared = new DiscordRepository(client);
    }
    return this._shared;
  }

  private client: Discord.Client;

  constructor(client: Discord.Client) {
    this.client = client;
  }

  fetchGuilds(): Promise<Guild[]> {
    return Promise.resolve(this.client.guilds.valueOf().map(guild => {
      return {
        id: guild.id,
        name: guild.name
      }
    }));
  }

  async fetchVoiceChannels(guildId: string): Promise<Channel[]> {
    const channels = await this.client.guilds.fetch(guildId, true)
      .then(guild => guild.channels)

    return channels.valueOf()
      .filter(channel => channel.type === 'voice')
      .map(channel => {
        return {
          id: channel.id,
          name: channel.name
        }
      })
  }

  async fetchChannelMembers(guildId: string, channelId: string): Promise<Member[]> {
    const guild = await this.client.guilds.fetch(guildId, true);
    const channel = guild.channels.valueOf().find((channel) => channel.id === channelId);
    return channel?.members?.map(member => {
      return {
        id: member.id,
        name: member.displayName,
        icon: member.user.avatarURL() ?? ''
      };
    }) ?? [];
  }

  async setMuteMembers(guildId: string, memberIds: string[], mute: boolean) {
    const guild = await this.client.guilds.fetch(guildId, true);

    return await Promise.all(memberIds.map(id => {
      return guild.member(id)?.voice?.setMute(mute);
    }));
  }

  async setMemberStatuses(guildId: string, nextMemberStatus: { deaf: boolean; mute: boolean; id: string }[]) {
    const guild = await this.client.guilds.fetch(guildId, true);

    return Promise.all(nextMemberStatus.map(({ id: member_id, deaf, mute }) => {
      return guild.member(member_id)?.edit({ deaf, mute }) ?? Promise.resolve(null);
      })
    );
  }
}