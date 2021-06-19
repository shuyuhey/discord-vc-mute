import { diffMuteState } from "./diffMuteState";

test('when given same statuses', () => {
  const current = [
    {
      memberId: 'a',
      mute: false,
      deaf: false
    },
    {
      memberId: 'b',
      mute: true,
      deaf: true
    }
  ];

  const next = [ ...current];
  expect(diffMuteState(current, next)).toEqual([]);
});

test('when given different statuses', () => {
  const current = [
    {
      memberId: 'a',
      mute: false,
      deaf: false
    },
    {
      memberId: 'b',
      mute: true,
      deaf: true
    },
    {
      memberId: 'c',
      mute: true,
      deaf: true
    }
  ];

  const next = [
    {
      memberId: 'a',
      mute: true,
      deaf: true
    },
    {
      memberId: 'b',
      mute: true,
      deaf: true
    },
    {
      memberId: 'c',
      mute: true,
      deaf: false
    },
    {
      memberId: 'd',
      mute: true,
      deaf: false
    }
  ];

  expect(diffMuteState(current, next)).toEqual([
    {
      memberId: 'a',
      mute: true,
      deaf: true
    },
    {
      memberId: 'c',
      mute: true,
      deaf: false
    },
    {
      memberId: 'd',
      mute: true,
      deaf: false
    }
  ]);
});