import React from "react";
import { useGameViewModel } from "../hooks/useGameViewModel";
import styled from "@emotion/styled";
import { PrimaryButton, SecondaryButton } from "./Button";

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
    <img src={props.icon} alt={`${props.name}のアイコン`} />
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
      {viewModel.gameInfo?.isStarted ? (
        <Container>
          <Header>
            <BackButtonWithIcon onClick={handlePlayControl}>ゲーム終了</BackButtonWithIcon>
          </Header>

          <MemberContainer>
            {viewModel.gameInfo?.members.map(member => (
              <MemberOnGame
                onClick={() => viewModel.setDied(member.id, !member.isDied)}
                isDied={member.isDied}
              >
                <MemberInfo name={member.name} icon={member.icon} />

                {member.isDied && (<DiedCaption>やられた！</DiedCaption>)}
              </MemberOnGame>
            ))}
          </MemberContainer>

          <ButtonContainer>
            {viewModel.gameInfo?.inMeeting ? (
              <SecondaryButton onClick={handleMeetingControl}>
                会議終了
              </SecondaryButton>
            ) : (
              <PrimaryButton onClick={handleMeetingControl}>
                会議開始
              </PrimaryButton>
            )}
          </ButtonContainer>
        </Container>
      ) : (
        <Container>
          <Header>
            <BackButtonWithIcon onClick={viewModel.backToSetting}>設定に戻る</BackButtonWithIcon>
          </Header>
          <MemberContainer>
            <ContentLabel>参加メンバー</ContentLabel>
            {viewModel.gameInfo?.members.map(member => (
              <MemberInfo name={member.name} icon={member.icon} />
            ))}
          </MemberContainer>

          <ButtonContainer>
            <SecondaryButton
              disabled={viewModel.gameInfo == null || viewModel.gameInfo.members.length < 1}
              onClick={handlePlayControl}>
              ゲーム開始
            </SecondaryButton>
          </ButtonContainer>
        </Container>
      )}
    </>
  );
}