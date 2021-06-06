import React from "react";
import styled from "@emotion/styled";
import { SecondaryButton, TextButton } from "../../components/Button";
import { SelectDiedCrewPopup } from "./SelectDiedCrewPopup";
import { Form, Formik } from "formik";
import { CrewSelect } from "./ClewSelect";
import { Title } from "./Elemtns";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  margin-top: auto;
  padding: 0 16px 16px;

  background: linear-gradient(rgb(26, 26, 26, 0) 0.5%, rgb(26, 26, 26, 0.8) 20%, rgb(26, 26, 26, 1));
`;

const StyledForm = styled(Form)`
  padding: 16px;
`;

type Props = {
  members: MemberWithGameInfo[];
  setDied: (id: string, isDied: boolean) => Promise<void>;
  setDiedWithoutUpdate: (id: string, isDied: boolean) => Promise<void>;
  onClickFinishMeeting: () => void;
}

export const MeetingView: React.FC<Props> = props => {
  const [isOpenPopup, setIsOpenPopup] = React.useState(true);

  return (
    <Container>

      <Title>
        追放する人を選んでください
        <TextButton onClick={() => {
          setIsOpenPopup(true);
        }}>キルされた人を選び直す</TextButton>
      </Title>


      <Formik<{
        members: {
          id: string;
          isDied: boolean;
        }[];
      }>
        onSubmit={(values) => {
          const diedMember = values.members.filter(m => m.isDied);

          return Promise.all(
            diedMember.map(member => {
              return props.setDiedWithoutUpdate(member.id, member.isDied);
            })
          ).then(() => {
            props.onClickFinishMeeting();
          })
        }}
        enableReinitialize
        initialValues={{
          members: props.members.map(member => ({
            id: member.id,
            isDied: member.isDied
          }))
        }}
      >
        {(helpers) => (
          <StyledForm>
            <CrewSelect members={props.members} shouldDiedMemberIsDisabled />

            <ButtonContainer>
              <SecondaryButton
                disabled={helpers.isSubmitting}
                type={'submit'}>
                会議終了
              </SecondaryButton>
            </ButtonContainer>
          </StyledForm>
        )}
      </Formik>

      {isOpenPopup && (
        <SelectDiedCrewPopup
          members={props.members}
          onUpdateStatus={(values) => {
            return Promise.all(
              values.map(member => {
                return props.setDied(member.id, member.isDied);
              })
            ).then(() => {
              setIsOpenPopup(false);
            });
          }}
        />
      )}
    </Container>
  );
}