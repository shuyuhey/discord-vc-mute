import { diedCompareFunction } from "./diedCompareFunction";

test('when given no args ordered by isDied asc', () => {
  const items = [
    { id: 1, isDied: false },
    { id: 2, isDied: true },
    { id: 3, isDied: false },
    { id: 4, isDied: true },
    { id: 5, isDied: true },
  ];

  const expected = [
    true, true, true, false, false
  ];

  const func = diedCompareFunction();
  expect(items.sort(func).map((i) => i.isDied )).toEqual(expected);
});

test('when given diedLast ordered by isDied desc', () => {
  const items = [
    { id: 1, isDied: false },
    { id: 2, isDied: true },
    { id: 3, isDied: false },
    { id: 4, isDied: true },
    { id: 5, isDied: true },
  ];

  const expected = [
    false, false, true, true, true
  ];

  const func = diedCompareFunction('diedLast');
  expect(items.sort(func).map((i) => i.isDied )).toEqual(expected);
});