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