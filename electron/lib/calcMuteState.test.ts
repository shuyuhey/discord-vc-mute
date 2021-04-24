import { discussionModeMuteState, playModeMuteState, standByMuteState } from "./calcMuteState";

describe('#discussionModeMuteState', () => {
  test('when given died member', () => {
    const member = {
      id: 'a',
      isDied: true
    };

    const expected = {
      memberId: 'a',
      mute: true,
      deaf: false
    };

    expect(discussionModeMuteState(member)).toEqual(expected)
  });

  test('when given live member', () => {
    const member = {
      id: 'a',
      isDied: false
    };

    const expected = {
      memberId: 'a',
      mute: false,
      deaf: false
    };

    expect(discussionModeMuteState(member)).toEqual(expected)
  });
});

describe('#playModeMuteState', () => {
  test('when given died member', () => {
    const member = {
      id: 'a',
      isDied: true
    };

    const expected = {
      memberId: 'a',
      mute: false,
      deaf: false
    };

    expect(playModeMuteState(member)).toEqual(expected)
  });

  test('when given live member', () => {
    const member = {
      id: 'a',
      isDied: false
    };

    const expected = {
      memberId: 'a',
      mute: true,
      deaf: true
    };

    expect(playModeMuteState(member)).toEqual(expected)
  });
});


describe('#standByMuteState', () => {
  test('when given died member', () => {
    const member = {
      id: 'a',
      isDied: true
    };

    const expected = {
      memberId: 'a',
      mute: false,
      deaf: false
    };

    expect(standByMuteState(member)).toEqual(expected)
  });

  test('when given live member', () => {
    const member = {
      id: 'a',
      isDied: false
    };

    const expected = {
      memberId: 'a',
      mute: false,
      deaf: false
    };

    expect(standByMuteState(member)).toEqual(expected)
  });
});