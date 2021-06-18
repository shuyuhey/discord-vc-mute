import { DiscordRepositoryInterface } from "./DiscordRepository";

export class MockedDiscordRepository implements DiscordRepositoryInterface {

  private members: Member[];

  constructor() {
    this.members = [];
  }

  fetchChannelMembers(guildId: string, channelId: string): Promise<Member[]> {
    if (this.members.length < 10) {
      const member = this.genMember();
      this.members = [...this.members, member];
    }
    return Promise.resolve(this.members);
  }

  fetchGuilds(): Promise<Guild[]> {
    return Promise.resolve([{ id: '1', name: 'テストサーバー' }]);
  }

  fetchVoiceChannels(guildId: string): Promise<Channel[]> {
    return Promise.resolve([
      { id: '1', name: 'ボイスチャンネル1'},
      { id: '2', name: 'ボイスチャンネル2'},
      { id: '3', name: 'ボイスチャンネル3'}
    ]);
  }

  setMemberStatus(guildId: string, state: MuteState): Promise<void> {
    return Promise.resolve(undefined);
  }

  setMemberStatuses(guildId: string, nextMemberStatus: MuteState[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  private genMember() {
    if (this.members.length === 0) {
      return { id: '1', name: 'メンバー1', icon: '' };
    }
    const memberLastId = this.members.reverse()[0].id;
    const newId = parseInt(memberLastId) + 1;
    return { id: String(newId), name: 'メンバー' + newId, icon: '' }
  }
}