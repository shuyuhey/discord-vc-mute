type Member = Pick<MemberWithGameInfo, 'id' | 'isDied'>;

export function discussionModeMuteState(member: Member): MuteState {
  return {
    memberId: member.id,
    mute: member.isDied,
    deaf: false
  }
}

export function playModeMuteState(member: Member): MuteState {
  return {
    memberId: member.id,
    mute: !member.isDied,
    deaf: !member.isDied,
  }
}

export function standByMuteState(member: Member): MuteState {
  return {
    memberId: member.id,
    mute: false,
    deaf: false,
  }
}