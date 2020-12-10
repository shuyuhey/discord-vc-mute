import { useSettingViewModel } from "../hooks/useSettingViewModel";
import React from "react";
import { Field, FieldProps, Form, Formik } from "formik";

export const SettingPage = () => {

  const viewModel = useSettingViewModel();

  React.useEffect(() => {
    viewModel.fetchGuilds().then(() => {
    });
  }, [viewModel]);

  return (
    <>

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
          <Form>
            <Field name={'guildId'}>
              {({ field }: FieldProps) => (
                <>
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      viewModel.selectGuild(e.target.value);
                    }}
                  >
                    <option> -- </option>
                    {viewModel.guilds?.map((guild) => (
                      <option value={guild.id}>{guild.name}</option>
                    ))}
                  </select>
                </>
              )}
            </Field>

            <Field name={'channelId'}>
              {({ field }: FieldProps) => (
                <>
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      viewModel.selectChannel(values.guildId, e.target.value);
                    }}
                  >
                    <option> -- </option>
                    {viewModel.channels?.map((channel) => (
                      <option value={channel.id}>{channel.name}</option>
                    ))}
                  </select>
                </>
              )}
            </Field>

            <div>
              {viewModel.members?.map((member) => (
                <div>{member.name}</div>
              ))}
            </div>

            <button type={'submit'}>設定完了</button>
          </Form>
        )}
      </Formik>
    </>
  );
};