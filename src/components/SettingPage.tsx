import { useSettingViewModel } from "../hooks/useSettingViewModel";
import React from "react";
import { Field, FieldProps, Form, Formik } from "formik";
import styled from "@emotion/styled";
import { PrimaryButton } from "./Button";

const Container = styled.div` 
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const FieldContainer = styled.div`
  > * + * {
    margin-top: 8px;
  }

  & + & {
    margin-top: 24px;
  }
`;

const FieldLabel = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  
  color: var(--gray-9);
`;

const SelectLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 100%;

  border: solid var(--gray-9) 2px;
  border-radius: 4px;
  box-sizing: border-box;
  
  > svg {
    position: absolute;
    right: 12px;
    width: 12px;
    top: calc(50% - 4px);
    pointer-events: none;
  }
`;

const Select = styled.select`
  background: transparent;
  appearance: none;
  outline: none;
  border: none;
  width: 100%;
  
  font-size: 20px;
  line-height: 23px;
  
  padding: 8px 32px 8px 16px;
`;

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = props => (
  <SelectLabel>
    <Select {...props} />

    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.59 0.294998L6 4.875L1.41 0.294998L0 1.705L6 7.705L12 1.705L10.59 0.294998Z" fill="#292B31" />
    </svg>
  </SelectLabel>
);

const ButtonContainer = styled.div`
  margin-top: auto;
`;

const StretchForm = styled(Form)`
  flex: 1;
  display: flex;
  flex-direction: column;
  
  padding: 32px 16px 16px;  
`;


export const SettingPage = () => {

  const viewModel = useSettingViewModel();

  React.useEffect(() => {
    viewModel.fetchGuilds().then(() => {
    });
  }, [viewModel]);

  return (
    <Container>
      <Formik<{
        guildId: string;
        channelId: string;
      }>
        onSubmit={(values) => {
          return viewModel.completeStandby(values.guildId, values.channelId);
        }}
        initialValues={{
          guildId: '',
          channelId: ''
        }}
      >
        {({ values }) => (
          <StretchForm>
            <Field name={'guildId'}>
              {({ field }: FieldProps) => (
                <FieldContainer>
                  <FieldLabel>サーバー</FieldLabel>
                  <SelectField
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      viewModel.selectGuild(e.target.value);
                    }}
                  >
                    <option> --</option>
                    {viewModel.guilds?.map((guild) => (
                      <option value={guild.id}>{guild.name}</option>
                    ))}
                  </SelectField>
                </FieldContainer>
              )}
            </Field>

            <Field name={'channelId'}>
              {({ field }: FieldProps) => (
                <FieldContainer>
                  <FieldLabel>チャンネル</FieldLabel>
                  <SelectField
                    {...field}
                  >
                    <option> --</option>
                    {viewModel.channels?.map((channel) => (
                      <option value={channel.id}>{channel.name}</option>
                    ))}
                  </SelectField>
                </FieldContainer>
              )}
            </Field>
            <ButtonContainer>
              <PrimaryButton type={'submit'}
                      disabled={!(values.guildId) || !(values.channelId)}
              >設定完了
              </PrimaryButton>
            </ButtonContainer>
          </StretchForm>
        )}
      </Formik>
    </Container>
  );
};