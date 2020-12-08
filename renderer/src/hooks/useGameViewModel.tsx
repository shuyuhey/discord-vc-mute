import React from "react";
import { invoke, subscribe } from "../lib/subscribe";

export function useGameViewModel() {
  const [gameInfo, setGameInfo] = React.useState<Optional<GameInfo>>(null);

  React.useEffect(() => {
    const unsubscribeGame = subscribe('UPDATE_GAME', (e, arg: GameInfo) => {
      setGameInfo(arg);
    });

    return () => {
      unsubscribeGame();
    };
  }, [setGameInfo]);

  const fetchGame = React.useCallback(() => {
    return invoke('REQUEST_FETCH_GAME');
  }, []);

  const startPlay = React.useCallback(() => {
    return invoke('START_PLAY');
  }, []);

  const startMeeting = React.useCallback(() => {
    return invoke('START_MEETING');
  }, []);

  const finishMeeting = React.useCallback(() => {
    return invoke('FINISH_MEETING');
  }, []);

  const finishPlay = React.useCallback(() => {
    return invoke('FINISH_PLAY');
  }, []);

  const setDied = React.useCallback((memberId: string, isDied: boolean) => {
    return invoke('SET_DIED', { memberId, isDied });
  }, []);

  return {
    gameInfo,
    fetchGame,
    startPlay,
    startMeeting,
    finishMeeting,
    finishPlay,
    setDied
  }
}