import React from "react";
import styled from "@emotion/styled";
import { SecondaryButton } from "../components/Button";
import { invoke } from "../lib/subscribe";
import { Header } from "../components/Header";
import { BackButtonWithIcon } from "../components/BackButtonWithIcon";
import { MemberInfo } from "../components/MemberInfo";
import { PlayView } from "../content/PlayView";
import { MeetingView } from "../content/MeetingView";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ClassNames, css } from "@emotion/react";

const MemberContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 16px;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  margin-top: auto;
  padding: 16px;

  background: linear-gradient(rgb(26, 26, 26, 0) 0.5%, rgb(26, 26, 26, 0.8) 20%, rgb(26, 26, 26, 1));
`;

const ContentLabel = styled.div`
  color: var(--gray-12);

  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.03em;
`;

const ContentContainer = styled.div`
  position: relative;
  padding-bottom: 87px;
`;

const StandByMemberContainerStyle = css`
  > * + * {
    margin-top: 12px;
  }
`;

const StandByMemberStyle = css`
  &-enter {
    opacity: 0;
    transform: translateX(-10px);
  }

  &-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: all 200ms ease-out;
  }

  &-exit {
    opacity: 1;
    transform: translateX(0);
  }

  &-exit-active {
    opacity: 0;
    transform: translateX(-10px);
    transition: all 200ms ease-out;
  }
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

  const setDiedWithoutUpdate = React.useCallback((memberId: string, isDied: boolean) => {
    setIsLoading(true);

    return invoke('SET_DIED_WITHOUT_UPDATE', { memberId, isDied })
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

  const handleStartMeeting = React.useCallback(() => {
    setIsLoading(true);

    return invoke('START_MEETING').then(info => {
      setIsLoading(false);
      setGameInfo(info);
    });
  }, []);

  const handleMeetingControl = React.useCallback(() => {
    setIsLoading(true);
    if (gameInfo?.inMeeting) {
      return invoke('FINISH_MEETING')
        .then((info) => {
          setIsLoading(false);
          setGameInfo(info);
        });
    } else {
      return invoke('TURN_TO_MEETING_MODE')
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

          <ContentContainer>
            {gameInfo?.inMeeting ? (
              <MeetingView
                setDied={setDied}
                startMeeting={handleStartMeeting}
                setDiedWithoutUpdate={setDiedWithoutUpdate}
                members={gameInfo?.members ?? []}
                onClickFinishMeeting={handleMeetingControl}
              />
            ) : (
              <PlayView
                setDied={setDied}
                members={gameInfo?.members ?? []}
                onClickStartMeeting={handleMeetingControl}
              />
            )}
          </ContentContainer>
        </>
      ) : (
        <>
          <Header>
            <BackButtonWithIcon onClick={backToSetting}>設定に戻る</BackButtonWithIcon>
          </Header>
          <MemberContainer>
            <ContentLabel>参加メンバー（{gameInfo?.members.length ?? 0}）</ContentLabel>
            <ClassNames>
              {({ css }) => (
                <TransitionGroup className={css(StandByMemberContainerStyle)}>
                  {gameInfo?.members.map(member => (
                    <CSSTransition
                      key={member.id}
                      timeout={200}
                      classNames={css(StandByMemberStyle)}
                    >
                      <MemberInfo
                        name={member.name}
                        icon={member.icon} />
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              )}
            </ClassNames>
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