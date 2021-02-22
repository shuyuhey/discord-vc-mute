import * as Discord from 'discord.js';

export class DiscordRepository {
  static shared: DiscordRepository;

  static async setupWithToken(token: string) {
    const client = new Discord.Client()
    await client.login(token);
    this.shared = new DiscordRepository(client);
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

  async setMemberStatus(guildId: string, memberId: string, mute: boolean, deaf: boolean) {
    const guild = await this.client.guilds.fetch(guildId, true);
    return guild.member(memberId)?.edit({ mute, deaf });
  }

  async setMemberStatuses(guildId: string, nextMemberStatus: { deaf: boolean; mute: boolean; id: string }[]) {
    const guild = await this.client.guilds.fetch(guildId, true);

    return Promise.all(nextMemberStatus.map(({ id: member_id, deaf, mute }) => {
      return guild.member(member_id)?.edit({ deaf, mute }) ?? Promise.resolve(null);
      })
    );
  }
}