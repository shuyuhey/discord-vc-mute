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

  const selectGuild = React.useCallback((id: string) => {
    return invoke('SELECT_GUILD', { guildId: id });
  }, []);

  const selectChannel = React.useCallback((meetingId, diedId) => {
    return invoke('SELECT_CHANNEL', { meetingId, diedId });
  }, []);

  const completeStandby = React.useCallback(() => {
    return invoke('COMPLETE_STANDBY', { memberIds: members?.map(member => member.id) ?? [] });
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