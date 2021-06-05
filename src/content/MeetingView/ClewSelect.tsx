import React from "react";
import styled from "@emotion/styled";
import { Field, FieldProps } from "formik";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  
  @media screen and (max-width: 450px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ItemContainer = styled.label<{ checked: boolean; disabled: boolean }>`
  ${props => props.checked ? (`
      --background: var(--green-2);
      --border: 2px solid var(--green);
      --hover: var(--green-3);
    `) : (`
      --background: var(--gray-2);
      --border: 2px solid var(--gray-2);
      --hover: var(--gray-3);
`)};

  background: var(--background);
  border: var(--border);
  border-radius: 8px;
  box-sizing: border-box;

  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-weight: bold;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.05em;
  color: var(--blue);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer' };

  &:hover {
    background: var(--hover);
  }
  
  ${props => props.disabled ? 'opacity: 0.3' : '' };

  > img {
    width: 24px;
    height: auto;
    line-height: 1;
    border-radius: 16px;
  }
`;

type Props = {
  members: MemberWithGameInfo[];
  shouldDiedMemberIsDisabled?: boolean;
};

export const CrewSelect: React.FC<Props> = props => {
  const orderedMembers = React.useMemo(() => {
    return props.members.sort((a, b) => {
      return a.isDied ? -1 : 1;
    })
  }, [props.members]);


  return (
    <Container>
      {orderedMembers.map((member, i) => (
        <React.Fragment key={member.id}>
          <Field name={`members.${i}.id`} type={'hidden'} />
          <Field name={`members.${i}.isDied`}>
            {({ field }: FieldProps) => (
              <ItemContainer
                checked={field.value}
                disabled={(member.isDied && !!props.shouldDiedMemberIsDisabled)}>
                <img src={member.icon} alt={`${member.name}のアイコン`}
                     onError={(e) => e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='} />
                <span>@{member.name}</span>

                <input type="checkbox"
                       {...field}
                       style={{ display: 'none' }}
                       disabled={(member.isDied && !!props.shouldDiedMemberIsDisabled)}
                       checked={field.value}
                />
              </ItemContainer>
            )}
          </Field>
        </React.Fragment>
      ))}
    </Container>
  );
}