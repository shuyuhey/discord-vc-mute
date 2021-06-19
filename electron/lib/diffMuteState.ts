
export function diffMuteState(current: MuteState[], next: MuteState[]): MuteState[] {
  const currentStateArray = [...current];

  const result: MuteState[] = [];

  next.forEach(n => {
    const index = currentStateArray.findIndex(c => c.memberId == n.memberId);

    if (index >= 0) {
      const c = currentStateArray[index];
      currentStateArray.splice(index, 1);

      if (c.mute == n.mute && c.deaf == n.deaf) {
        return;
      }
    }
    result.push(n);
  });


  return result;
}