import { Snowflake } from 'discord.js';
import { DiscordRepository } from "./DiscordRepository";

export class GameMasterBot {
  private guildId: Snowflake;
  private meetingChannelId: Snowflake;
  private members: MemberWithGameInfo[];
  private isStarted: boolean;
  private inMeeting: boolean;

  private repository: DiscordRepository;

  constructor(
    guildId: Snowflake,
    meetingChannelId: Snowflake,
    repository: DiscordRepository
  ) {
    this.guildId = guildId;
    this.meetingChannelId = meetingChannelId;
    this.members = [];

    this.isStarted = false;
    this.inMeeting = false;

    this.repository = repository;
  }

  async syncCurrentChannelMembers() {
    const members = await this.repository.fetchChannelMembers(this.guildId, this.meetingChannelId);

    this.members = members.map(member => {
      return {
        id: member.id,
        name: member.name,
        icon: member.icon,
        color: 0,
        isDied: false
      };
    });
  }

  setDied(memberId: string, isDied: boolean) {
    this.members = this.members.map(member => ({
      ...member,
      isDied: member.id == memberId ? isDied : member.isDied
    }));
  }

  makePlayMode() {
    return Promise.all([
      this.repository.setDeafMembers(this.guildId,
        this.members.filter(member => !member.isDied).map(member => member.id), true),
      this.repository.setMuteMembers(this.guildId,
        this.members.filter(member => member.isDied).map(member => member.id), false)
    ]).then(() => {
      this.inMeeting = false;
    });
  }

  makeDiscussionMode() {
    return Promise.all([
      this.repository.setDeafMembers(this.guildId,
        this.members.map(member => member.id), false),
      this.repository.setMuteMembers(this.guildId,
        this.members.filter(member => member.isDied).map(member => member.id), true)
    ]).then(() => {
      this.inMeeting = true;
    });
  }

  startPlay() {
    return this.makePlayMode()
      .then(() => {
        this.isStarted = true;
      });
  }

  finishPlay() {
    return Promise.all([
      this.repository.setDeafMembers(this.guildId, this.members.map(member => member.id), false),
      this.repository.setMuteMembers(this.guildId, this.members.map(member => member.id), false)
    ]).then(() => {
      this.members = this.members.map(member => ({
        ...member,
        isDied: false
      }));
      this.isStarted = false;
      this.inMeeting = false;
    });
  }

  get gameInfo(): GameInfo {
    return {
      inMeeting: this.inMeeting,
      isStarted: this.isStarted,
      members: this.members
    }
  }
}