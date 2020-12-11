import React from "react";
import { useGameViewModel } from "../hooks/useGameViewModel";
import styled from "@emotion/styled";

const Container = styled.div` 
  display: flex;
  flex-direction: column;
  min-height: 100%;  
`;

const PrimaryButton = styled.button`
  appearance: none;
  outline: none;
  box-sizing: border-box;

  padding: 16px 0;
  width: 100%;  
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F2F2F2;
  border: 2px solid #F2F2F2;
  border-radius: 4px;

  font-weight: bold;  
  font-size: 20px;
  line-height: 23px;

  color: #000000;
`;

const SecondaryButton = styled.button`
  appearance: none;
  outline: none;
  box-sizing: border-box;

  padding: 16px 0;
  width: 100%;  
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 2px solid #000000;
  background: transparent;
  
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;

  color: #000000;
`;

const MemberContainer = styled.div`
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
  
  > * + * {
    margin-left: 8px;
  }
`;

const MemberInfo: React.FC<{ name: string; icon: string; }> = (props) => (
  <MemberInfoContainer>
    <img src={props.icon} alt={`${props.name}のアイコン`} />
    <span>{props.name}</span>
  </MemberInfoContainer>
);


const MemberOnGame = styled.button<{ isDied: boolean }>`
  appearance: none;
  outline: none;
  
  padding: 16px 24px;
  background: #F2F2F2;
  border-radius: 50px;
  
  display: flex;
  align-items: center;
  
  color: ${props => props.isDied ? 'red' : '#000000'};
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

  display: flex;
  align-items: center;
  border-radius: 4px;
  background: transparent;
  
  color: #000000;
  
  font-size: 16px;
  line-height: 19px;
  
  svg {
    margin-right: 8px;
  }
`;

const BackButtonWithIcon: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => (
  <BackButton {...props}>
    <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.82843 9.50001L10.1213 16.7929L8.70711 18.2071L0 9.50001L8.70711 0.792908L10.1213 2.20712L2.82843 9.50001Z" fill="black"/>
    </svg>
    {props.children}
  </BackButton>
);

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
                <MemberInfo name={member.name} icon={''} />
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
            <BackButtonWithIcon >設定に戻る</BackButtonWithIcon>
          </Header>
          <MemberContainer>
            {viewModel.gameInfo?.members.map(member => (
              <button onClick={() => viewModel.setDied(member.id, !member.isDied)}>
                {member.name}
                <br />
                {member.color}
              </button>
            ))}
          </MemberContainer>

          <ButtonContainer>
            <SecondaryButton onClick={handlePlayControl}>
              ゲーム開始
            </SecondaryButton>
          </ButtonContainer>
        </Container>
      )}
    </>
  );
}