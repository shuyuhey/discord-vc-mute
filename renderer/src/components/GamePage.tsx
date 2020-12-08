import React from "react";
import { useGameViewModel } from "../hooks/useGameViewModel";

export const GamePage: React.FC<{}> = () => {

  const viewModel = useGameViewModel();

  React.useEffect(() => {
    viewModel.fetchGame();
  }, [viewModel]);

  const handlePlayControl = React.useCallback(() => {
    if (viewModel.gameInfo?.isStarted) {
      return viewModel.finishPlay();
    } else {
      return viewModel.startPlay();
    }
  }, [viewModel]);

  const handleMeetingControl = React.useCallback(() => {
    if (viewModel.gameInfo?.inMeeting) {
      return viewModel.finishMeeting();
    } else {
      return viewModel.startMeeting();
    }
  }, [viewModel]);

  return (
    <>
      <div>
        <button onClick={handleMeetingControl}>{viewModel.gameInfo?.inMeeting ? '会議終了' : '会議開始'}</button>
        <button onClick={handlePlayControl}>{viewModel.gameInfo?.isStarted ? 'ゲーム終了' : 'ゲーム開始'}</button>
      </div>

      <div>
        {viewModel.gameInfo?.members.map(member => (
          <button onClick={() => viewModel.setDied(member.id, !member.isDied)}>
            {member.name}
            <br />
            {member.color}
            <br />
            {member.isDied ? '死んでる' : '生きてる'}
          </button>
        ))}
      </div>
    </>
  );
}