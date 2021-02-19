import { Snowflake } from 'discord.js';
import { DiscordRepository } from "./DiscordRepository";

export class GameMasterBot {
  private readonly guildId: Snowflake;
  private readonly meetingChannelId: Snowflake;
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
    return this.repository.setMuteMembers(this.guildId,[memberId], true)
      .then(() => {
        this.members = this.members.map(member => ({
          ...member,
          isDied: member.id == memberId ? isDied : member.isDied
        }));
      });
  }

  makePlayMode() {
    const nextMemberStatus = this.members.map((member) => {
      return {
        id: member.id,
        mute: !member.isDied,
        deaf: !member.isDied
      };
    })

    return this.repository.setMemberStatuses(this.guildId, nextMemberStatus)
      .then(() => {
        this.inMeeting = false;
      });
  }

  makeDiscussionMode() {
    const nextMemberStatus = this.members.map((member) => {
      return {
        id: member.id,
        mute: member.isDied,
        deaf: false
      };
    })

    return this.repository.setMemberStatuses(this.guildId, nextMemberStatus)
      .then(() => {
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
    const nextMemberStatus = this.members.map((member) => {
      return {
        id: member.id,
        mute: false,
        deaf: false
      };
    })

    return this.repository.setMemberStatuses(this.guildId, nextMemberStatus)
      .then(() => {
        this.inMeeting = true;
      })
      .then(() => {
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