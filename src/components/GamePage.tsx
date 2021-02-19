import React from "react";
import styled from "@emotion/styled";
import { PrimaryButton, SecondaryButton } from "./Button";
import { invoke } from "../lib/subscribe";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const MemberContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 16px;
  }
`;

const Header = styled.header`
  padding: 16px;
  display: flex;
  align-items: center;
`;

const MemberInfoContainer = styled.div`
  display: flex;
  align-items: center;

  font-size: 16px;
  line-height: 19px;
  color: var(--blue);

  > img {
    width: 32px;
    height: auto;
    line-height: 1;
    border-radius: 16px;
  }

  > * + * {
    margin-left: 8px;
  }
`;

const MemberInfo: React.FC<{ name: string; icon: string; }> = (props) => (
  <MemberInfoContainer>
    <img src={props.icon} alt={`${props.name}のアイコン`}
         onError={(e) => e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='} />
    <span>@{props.name}</span>
  </MemberInfoContainer>
);


const MemberOnGame = styled.button<{ isDied: boolean }>`
  appearance: none;
  outline: none;
  border: none;

  padding: 16px 24px;
  background: #F2F2F2;
  border-radius: 50px;

  display: flex;
  align-items: center;

  cursor: pointer;

  ${props => props.isDied ? 'filter: grayscale(100%);' : ''};
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding: 16px;
`;

const BackButton = styled.button`
  appearance: none;
  outline: none;
  border: none;
  box-sizing: border-box;
  cursor: pointer;

  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background: transparent;

  color: var(--gray-9);

  font-size: 12px;
  line-height: 14px;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background: var(--gray-1);
  }
`;

const BackButtonWithIcon: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => (
  <BackButton {...props}>
    <svg height="14" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M2.82843 9.50001L10.1213 16.7929L8.70711 18.2071L0 9.50001L8.70711 0.792908L10.1213 2.20712L2.82843 9.50001Z"
            fill="#292b31" />
    </svg>
    {props.children}
  </BackButton>
);

const DiedCaption = styled.div`
  margin-left: auto;
  font-size: 12px;
  line-height: 12px;
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
    invoke('REQUEST_SYNC_MEMBER');

    if (gameInfo?.isStarted) {
      return;
    }

    const id = setInterval(() => {
      return invoke('REQUEST_SYNC_MEMBER');
    }, 5000);

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
        <Container>
          <Header>
            <BackButtonWithIcon onClick={handlePlayControl}>ゲーム終了</BackButtonWithIcon>
          </Header>

          <MemberContainer>
            {gameInfo?.members.map(member => (
              <MemberOnGame
                onClick={() => setDied(member.id, !member.isDied)}
                isDied={member.isDied}
              >
                <MemberInfo name={member.name} icon={member.icon} />

                {member.isDied && (<DiedCaption>やられた！</DiedCaption>)}
              </MemberOnGame>
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
        </Container>
      ) : (
        <Container>
          <Header>
            <BackButtonWithIcon onClick={backToSetting}>設定に戻る</BackButtonWithIcon>
          </Header>
          <MemberContainer>
            <ContentLabel>参加メンバー</ContentLabel>
            {gameInfo?.members.map(member => (
              <MemberInfo name={member.name} icon={member.icon} />
            ))}
          </MemberContainer>

          <ButtonContainer>
            <SecondaryButton
              disabled={gameInfo == null || gameInfo.members.length < 1}
              onClick={handlePlayControl}>
              ゲーム開始
            </SecondaryButton>
          </ButtonContainer>
        </Container>
      )}
    </>
  );
}