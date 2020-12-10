import React from "react";
import { invoke, subscribe } from "../lib/subscribe";

export function useSettingViewModel() {
  const [guilds, setGuilds] = React.useState<Optional<Guild[]>>(null);
  const [channels, setChannels] = React.useState<Optional<Channel[]>>(null);
  const [members, setMembers] = React.useState<Optional<Member[]>>(null);

  React.useEffect(() => {
    const unsubscribeGuild = subscribe<Guild[]>('COMPLETE_FETCH_GUILDS', (e, guilds) => {
      setGuilds(guilds);
    });
    const unsubscribeChannel = subscribe<Channel[]>('COMPLETE_FETCH_CHANNELS', (e, guilds) => {
      setChannels(guilds);
    });
    const unsubscribeMember = subscribe<Member[]>('COMPLETE_FETCH_MEMBERS', (e, guilds) => {
      setMembers(guilds);
    });

    return () => {
      unsubscribeGuild();
      unsubscribeChannel();
      unsubscribeMember();
    }
  }, [setGuilds, setChannels, setMembers]);

  const fetchGuilds = React.useCallback(() => {
    return invoke('REQUEST_FETCH_GUILD');
  }, []);

  const selectGuild = React.useCallback((guildId: string) => {
    return invoke('REQUEST_FETCH_CHANNELS', { guildId });
  }, []);

  const selectChannel = React.useCallback((guildId: string, channelId: string) => {
    return invoke('REQUEST_FETCH_MEMBERS', { guildId, channelId });
  }, []);

  const completeStandby = React.useCallback((guildId: string, channelId: string) => {
    return invoke('COMPLETE_STANDBY', { guildId, channelId });
  }, [members]);

  return {
    guilds,
    channels,
    members,
    fetchGuilds,
    selectGuild,
    selectChannel,
    completeStandby
  }
}