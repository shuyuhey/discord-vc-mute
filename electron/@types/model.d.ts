type ChannelResponse = {
  id: string;
  name: string;
  type: number;
}

type Guild = {
  id: string;
  name: string;
}

type Channel = {
  id: string;
  name: string;
}

type Member = {
  id: string;
  name: string;
  icon: string;
}

interface MuteState {
  memberId: string;
  mute: boolean;
  deaf: boolean;
}

type MemberWithGameInfo = Member & {
  color: number;
  isDied: boolean;
};

type GameInfo = {
  isStarted: boolean;
  inMeeting: boolean;
  members: MemberWithGameInfo[];
}