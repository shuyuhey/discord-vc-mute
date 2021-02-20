import React from "react";
import styled from "@emotion/styled";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import { invoke } from "../lib/subscribe";
import { Header } from "../components/Header";
import { BackButtonWithIcon } from "../components/BackButtonWithIcon";
import { MemberInfoOnGame } from "../components/MemberInfoOnGame";
import { MemberInfo } from "../components/MemberInfo";

const MemberContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 16px;
  }
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding: 16px;
`;

const ContentLabel = styled.div`
  color: var(--gray-9);

  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
`;

export const GamePage: React.FC<{}> = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [gameInfo, setGameInfo] = React.useState<Optional<GameInfo>>(null);

  React.useEffect(() => {
    invoke('REQUEST_SYNC_MEMBER').then((game) => setGameInfo(game));

    if (gameInfo?.isStarted) {
      return;
    }

    const id = setInterval(() => {
      invoke('REQUEST_SYNC_MEMBER').then((game) => setGameInfo(game));
    }, 3000);

    return () => {
      clearInterval(id);
    };
  }, [gameInfo?.isStarted]);

  React.useEffect(() => {
    document.body.style.cursor = isLoading ? 'wait' : 'auto';
  }, [isLoading]);

  React.useEffect(() => {
    invoke('REQUEST_FETCH_GAME')
      .then((info) => setGameInfo(info));
  }, [setGameInfo]);

  const backToSetting = React.useCallback(() => {
    return invoke('RESET_SETTING');
  }, []);

  const setDied = React.useCallback((memberId: string, isDied: boolean) => {
    setIsLoading(true);

    return invoke('SET_DIED', { memberId, isDied })
      .then((info) => {
        setIsLoading(false);
        setGameInfo(info);
      });
  }, [setGameInfo, setIsLoading]);

  const handlePlayControl = React.useCallback(() => {
    if (gameInfo?.isStarted) {
      return invoke('FINISH_PLAY')
        .then((info) => setGameInfo(info));
    } else {
      return invoke('START_PLAY')
        .then((info) => setGameInfo(info));
    }
  }, [gameInfo, setGameInfo]);

  const handleMeetingControl = React.useCallback(() => {
    setIsLoading(true);
    if (gameInfo?.inMeeting) {
      return invoke('FINISH_MEETING')
        .then((info) => {
          setIsLoading(false);
          setGameInfo(info);
        });
    } else {
      return invoke('START_MEETING')
        .then((info) => {
          setIsLoading(false);
          setGameInfo(info);
        });
    }
  }, [gameInfo, setGameInfo, setIsLoading]);

  return (
    <>
      {gameInfo?.isStarted ? (
        <>
          <Header>
            <BackButtonWithIcon onClick={handlePlayControl}>ゲーム終了</BackButtonWithIcon>
          </Header>

          <MemberContainer>
            {gameInfo?.members.map(member => (
              <MemberInfoOnGame
                {...member}
                key={member.id}
                setDied={setDied}
              />
            ))}
          </MemberContainer>

          <ButtonContainer>
            {gameInfo?.inMeeting ? (
              <SecondaryButton
                disabled={isLoading}
                onClick={handleMeetingControl}>
                会議終了
              </SecondaryButton>
            ) : (
              <PrimaryButton
                disabled={isLoading}
                onClick={handleMeetingControl}>
                会議開始
              </PrimaryButton>
            )}
          </ButtonContainer>
        </>
      ) : (
        <>
          <Header>
            <BackButtonWithIcon onClick={backToSetting}>設定に戻る</BackButtonWithIcon>
          </Header>
          <MemberContainer>
            <ContentLabel>参加メンバー</ContentLabel>
            {gameInfo?.members.map(member => (
              <MemberInfo
                key={member.id}
                name={member.name}
                icon={member.icon} />
            ))}
          </MemberContainer>

          <ButtonContainer>
            <SecondaryButton
              disabled={gameInfo == null || gameInfo.members.length < 1}
              onClick={handlePlayControl}>
              {(gameInfo?.members?.length ?? 0) > 0 ? 'ゲーム開始' : 'メンバーを待機中'}
            </SecondaryButton>
          </ButtonContainer>
        </>
      )}
    </>
  );
}