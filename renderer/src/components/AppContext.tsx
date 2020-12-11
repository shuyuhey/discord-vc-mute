import React from "react";
import { subscribe } from "../lib/subscribe";


type AppContextState = {
  mode: 'SETTING' | 'GAME';
}

export const AppContext = React.createContext<AppContextState>({
  mode: "SETTING"
});


export const AppContextProvider: React.FC<{ mode?: AppContextState['mode'] }> = props => {
  const [mode, setMode] = React.useState<AppContextState['mode']>(props.mode ?? 'SETTING');

  React.useEffect(() => {
    const unsubscribeInitialMode = subscribe('UPDATE_MODE', (e, arg: AppContextState['mode']) => {
      setMode(arg);
    });


    const unsubscribeMode = subscribe('START_GAME', (e, arg: any) => {
      setMode('GAME');
    });

    return () => {
      unsubscribeInitialMode();
      unsubscribeMode();
    }
  }, [setMode]);

  return (
    <AppContext.Provider value={{
      mode
    }}>
      {props.children}
    </AppContext.Provider>
  );
};