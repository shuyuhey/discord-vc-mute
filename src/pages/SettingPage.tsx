import React from "react";
import { Field, FieldProps, Formik } from "formik";
import styled from "@emotion/styled";
import { PrimaryButton } from "../components/Button";
import { invoke } from "../lib/subscribe";
import { FieldContainer, FieldLabel, StretchForm } from "../components/FormComponents";
import { SelectField } from "../components/SelectField";
import { Header } from "../components/Header";
import { BackButtonWithIcon } from "../components/BackButtonWithIcon";

const ButtonContainer = styled.div`
  margin-top: auto;
`;

export const SettingPage = () => {
  const [guilds, setGuilds] = React.useState<Guild[]>([]);
  const [channels, setChannels] = React.useState<Channel[]>([]);


  React.useEffect(() => {
    invoke('REQUEST_FETCH_GUILD').then((guilds) => {
      setGuilds(guilds)
    });
  }, [setGuilds]);

  const selectGuild = React.useCallback((guildId) => {
    invoke('REQUEST_FETCH_CHANNELS', { guildId })
      .then((channels) => {
        setChannels(channels);
      });
  }, [setChannels]);

  return (
    <>
      <Header>
        <BackButtonWithIcon onClick={() => {
          return invoke('RESET_TOKEN');
        }}> トークン設定に戻る</BackButtonWithIcon>
      </Header>
      <Formik<{
        guildId: string;
        channelId: string;
      }>
        onSubmit={({ guildId, channelId }) => {
          return invoke('COMPLETE_STANDBY', { guildId, channelId });
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

                      selectGuild(e.target.value);
                    }}
                  >
                    <option> --</option>
                    {guilds.map((guild) => (
                      <option key={guild.id} value={guild.id}>{guild.name}</option>
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
                    {channels.map((channel) => (
                      <option key={channel.id} value={channel.id}>{channel.name}</option>
                    ))}
                  </SelectField>
                </FieldContainer>
              )}
            </Field>
            <ButtonContainer>
              <PrimaryButton
                type={'submit'}
                disabled={!(values.guildId) || !(values.channelId)}
              >設定完了
              </PrimaryButton>
            </ButtonContainer>
          </StretchForm>
        )}
      </Formik>
    </>
  );
};