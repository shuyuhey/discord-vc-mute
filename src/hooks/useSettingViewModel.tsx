import React from "react";
import { invoke, subscribe } from "../lib/subscribe";

export function useSettingViewModel() {
  const [guilds, setGuilds] = React.useState<Optional<Guild[]>>(null);
  const [channels, setChannels] = React.useState<Optional<Channel[]>>(null);

  React.useEffect(() => {
    const unsubscribeGuild = subscribe<Guild[]>('COMPLETE_FETCH_GUILDS', (e, guilds) => {
      setGuilds(guilds);
    });
    const unsubscribeChannel = subscribe<Channel[]>('COMPLETE_FETCH_CHANNELS', (e, guilds) => {
      setChannels(guilds);
    });

    return () => {
      unsubscribeGuild();
      unsubscribeChannel();
    }
  }, [setGuilds, setChannels]);

  const fetchGuilds = React.useCallback(() => {
    return invoke('REQUEST_FETCH_GUILD');
  }, []);

  const selectGuild = React.useCallback((guildId: string) => {
    return invoke('REQUEST_FETCH_CHANNELS', { guildId });
  }, []);

  const completeStandby = React.useCallback((guildId: string, channelId: string) => {
    return invoke('COMPLETE_STANDBY', { guildId, channelId });
  }, []);

  return {
    guilds,
    channels,
    fetchGuilds,
    selectGuild,
    completeStandby
  }
}