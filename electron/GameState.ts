import { diedCompareFunction } from "./lib/diedCompareFunction";
import { discussionModeMuteState, playModeMuteState, standByMuteState } from "./lib/calcMuteState";

export class GameState {
  private members: MemberWithGameInfo[];
  private isStarted: boolean;
  private inMeeting: boolean;

  constructor() {
    this.members = [];
    this.isStarted = false;
    this.inMeeting = false;
  }

  async syncCurrentChannelMembers(members: Member[]) {
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

  get currentMuteStatus() {
    if (this.isStarted) {
      if (this.inMeeting) {
        return this.members
          .sort(diedCompareFunction('diedFirst'))
          .map(discussionModeMuteState);
      }
      return this.members
        .sort(diedCompareFunction('diedLast'))
        .map(playModeMuteState);

    }

    return this.members
      .sort(diedCompareFunction('diedLast'))
      .map(standByMuteState);
  }

  get gameInfo(): GameInfo {
    return {
      inMeeting: this.inMeeting,
      isStarted: this.isStarted,
      members: this.members
    }
  }

  setDied(memberId: string, isDied: boolean): MuteState {
    this.members = this.members.map(member => ({
      ...member,
      isDied: member.id == memberId ? isDied : member.isDied
    }));

    if (this.inMeeting) {
      return discussionModeMuteState({ id: memberId, isDied: isDied })
    } else {
      return playModeMuteState({ id: memberId, isDied: isDied })
    }
  }

  makePlayMode() {
    this.inMeeting = false;
  }

  makeDiscussionMode() {
    this.inMeeting = true;
  }

  startPlay() {
    this.isStarted = true;
  }

  finishPlay() {
    this.members = this.members.map(member => ({
      ...member,
      isDied: false
    }));

    this.isStarted = false;
    this.inMeeting = false;
  }
}