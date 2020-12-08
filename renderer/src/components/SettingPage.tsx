import { useSettingViewModel } from "../hooks/useSettingViewModel";
import React from "react";

export const SettingPage = () => {

  const viewModel = useSettingViewModel();

  React.useEffect(() => {
    viewModel.fetchGuilds().then(() => {});
  }, [viewModel]);

  return (
    <>
      <div>
        {viewModel.guilds?.map((guild) => (
          <button onClick={() => viewModel.selectGuild(guild.id)}>{guild.name}</button>
        ))}
      </div>

      <div>
        {viewModel.channels?.map((channel) => (
          <button onClick={() => viewModel.selectChannel(channel.id, '')}>{channel.name}</button>
        ))}
      </div>

      <div>
        {viewModel.members?.map((member) => (
          <div>{member.name}</div>
        ))}
      </div>

      <button onClick={viewModel.completeStandby}>COMPLETE</button>
    </>
  );
};