import { DiscordWorkerInterface } from "./DiscordWorker";
import { Snowflake } from "discord.js";

export class MockedDiscordWorker implements DiscordWorkerInterface {

  private members: Member[];

  constructor() {
    this.members = [];
  }

  fetchChannelMembers(): Member[] {
    if (this.members.length < 10) {
      const member = this.genMember();
      this.members = [...this.members, member];
    }
    return this.members;
  }

  fetchGuilds(): Guild[] {
    return [{ id: '1', name: 'テストサーバー' }];
  }

  fetchVoiceChannels(): Channel[] {
    return [
      { id: '1', name: 'ボイスチャンネル1'},
      { id: '2', name: 'ボイスチャンネル2'},
      { id: '3', name: 'ボイスチャンネル3'}
    ];
  }

  setMemberStatus(state: MuteState): Promise<void> {
    return Promise.resolve(undefined);
  }

  setAllMemberStatus(nextMemberStatus: MuteState[]): Promise<void> {
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

  selectChannel(channelId: Snowflake): Promise<void> {
    return Promise.resolve(undefined);
  }

  selectGuild(guildId: Snowflake): Promise<void> {
    return Promise.resolve(undefined);
  }
}