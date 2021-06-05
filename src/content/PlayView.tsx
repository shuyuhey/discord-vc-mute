import React from "react";
import styled from "@emotion/styled";
import { MemberInfoOnGame } from "../components/MemberInfoOnGame";
import { PrimaryButton } from "../components/Button";

const Container = styled.div``;

const MembersContainer = styled.div`
  box-sizing: border-box;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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

type Props = {
  members: MemberWithGameInfo[];
  setDied: (id: string, isDied: boolean) => Promise<void>;
  onClickStartMeeting: () => void;
}

export const PlayView: React.FC<Props> = props => (
  <Container>
    <MembersContainer>
      {props.members.map(member => (
        <MemberInfoOnGame
          {...member}
          key={member.id}
          setDied={props.setDied}
        />
      ))}
    </MembersContainer>

    <ButtonContainer>
      <PrimaryButton
        onClick={props.onClickStartMeeting}
      >
        会議開始
      </PrimaryButton>
    </ButtonContainer>
  </Container>
)