import React from "react";
import { Form, Formik } from "formik";
import { CrewSelect } from "./ClewSelect";
import styled from "@emotion/styled";
import { PrimaryButton } from "../../components/Button";
import { Title } from "./Elemtns";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;

  background: rgba(170, 170, 170, 0.3);
  backdrop-filter: blur(2px);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  
  animation: ${fadeIn} 200ms ease-out;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  overflow: auto;
  max-height: 100%;

  min-width: 320px;
  padding: 32px 24px;
  background: var(--gray-1);
  border-radius: 16px;
  box-shadow: rgba(18, 17, 26, 0.2) 1px 1px 20px;
`;

type Props = {
  members: MemberWithGameInfo[];
  onUpdateStatus: (status: { id: string; isDied: boolean }[]) => void;
};

export const SelectDiedCrewPopup: React.FC<Props> = props => {

  return (
    <Container>
      <Formik<{
        members: {
          id: string;
          isDied: boolean;
        }[];
      }>
        onSubmit={(values) => {
          const changeStatusMembers = values.members.filter(member => {
            const currentMember = props.members.find(m => m.id === member.id);

            return currentMember?.isDied != member.isDied;
          });

          props.onUpdateStatus(changeStatusMembers);
        }}
        initialValues={{
          members: props.members.map(member => ({
            id: member.id,
            isDied: member.isDied
          }))
        }}
      >
        {(helpers) => (

          <StyledForm>
            <Title>キルされた人を選んでください</Title>
            <CrewSelect members={props.members} />
            <PrimaryButton
              disabled={helpers.isSubmitting}
              type={'submit'}
            >
              OK
            </PrimaryButton>
          </StyledForm>
        )}
      </Formik>
    </Container>
  );
}