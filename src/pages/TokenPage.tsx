import React from "react";
import { Field, FieldProps, Formik } from "formik";
import { FieldContainer, FieldLabel, StretchForm } from "../components/FormComponents";
import { InputField } from "../components/InputField";
import styled from "@emotion/styled";
import { PrimaryButton } from "../components/Button";
import { invoke } from "../lib/subscribe";

const ButtonContainer = styled.div`
  margin-top: auto;
`;

export const TokenPage = () => {
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    invoke('FETCH_BOT_TOKEN').then((token) => setToken(token));
  }, [setToken])

  return (
    <Formik<{
      token: string;
    }>
      enableReinitialize
      initialValues={{ token: token }}
      onSubmit={(values) => {
        invoke('SET_BOT_TOKEN', values).then();
      }}
    >
      {({ isValid, isSubmitting }) => (
        <StretchForm>
          <Field name={'token'}>
            {({ field }: FieldProps) => (
              <FieldContainer>
                <FieldLabel>Bot Token</FieldLabel>
                <InputField type={'password'} {...field} />
              </FieldContainer>
            )}
          </Field>

          <ButtonContainer>
            <PrimaryButton
              type={'submit'}
              disabled={!isValid || isSubmitting}
            >次へ
            </PrimaryButton>
          </ButtonContainer>

        </StretchForm>
      )}
    </Formik>
  );
};