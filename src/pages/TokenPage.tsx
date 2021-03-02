import React from "react";
import { Field, FieldProps, Formik } from "formik";
import { ErrorLabel, FieldContainer, FieldLabel, StretchForm } from "../components/FormComponents";
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
      onSubmit={(values, formikHelpers) => {
        invoke('SET_BOT_TOKEN', values)
          .catch((error) => {
            formikHelpers.setErrors({ 'token': 'トークンが間違っています' });
            formikHelpers.setSubmitting(false);
          });
      }}
    >
      {({ isValid, isSubmitting }) => (
        <StretchForm>
          <Field name={'token'}>
            {({ field, meta }: FieldProps) => (
              <FieldContainer>
                <FieldLabel>Bot Token</FieldLabel>
                <InputField type={'password'} {...field} />

                {meta.error && meta.touched && (
                  <div style={{ marginTop: 8 }}>
                    <ErrorLabel>{meta.error}</ErrorLabel>
                  </div>
                )}
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