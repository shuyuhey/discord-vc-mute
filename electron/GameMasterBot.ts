import { Snowflake } from 'discord.js';
import { DiscordRepositoryInterface } from "./DiscordRepository/DiscordRepository";
import { diedCompareFunction } from "./lib/diedCompareFunction";
import { discussionModeMuteState, playModeMuteState, standByMuteState } from "./lib/calcMuteState";

export class GameMasterBot {
  private readonly guildId: Snowflake;
  private readonly meetingChannelId: Snowflake;
  private members: MemberWithGameInfo[];
  private isStarted: boolean;
  private inMeeting: boolean;

  private repository: DiscordRepositoryInterface;

  constructor(
    guildId: Snowflake,
    meetingChannelId: Snowflake,
    repository: DiscordRepositoryInterface
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
    const state = (()=>{
      if (this.inMeeting) {
        return discussionModeMuteState({ id: memberId, isDied: isDied })
      } else {
        return playModeMuteState({ id: memberId, isDied: isDied })
      }
    })();

    return this.repository.setMemberStatus(this.guildId, state)
      .then(() => {
        this.members = this.members.map(member => ({
          ...member,
          isDied: member.id == memberId ? isDied : member.isDied
        }));
      });
  }

  setStatusWithoutUpdate(memberId: string, isDied: boolean) {
    this.members = this.members.map(member => ({
      ...member,
      isDied: member.id == memberId ? isDied : member.isDied
    }));
  }

  makePlayMode() {
    const nextMemberStatus = this.members
      .sort(diedCompareFunction('diedLast'))
      .map(playModeMuteState);

    return this.repository.setMemberStatuses(this.guildId, nextMemberStatus)
      .then(() => {
        this.inMeeting = false;
      });
  }

  makeDiscussionMode() {
    const nextMemberStatus = this.members
      .sort(diedCompareFunction('diedFirst'))
      .map(discussionModeMuteState);

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
    const nextMemberStatus = this.members
      .sort(diedCompareFunction('diedLast'))
      .map(standByMuteState);

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