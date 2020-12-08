import React from "react";
import { AppContext, AppContextProvider } from "./AppContext";
import { SettingPage } from "./SettingPage";
import { GamePage } from "./GamePage";

export const App: React.FC<{}> = () => (
  <AppContextProvider>
    <AppContext.Consumer>
      {({ mode }) => {
        return {
          "SETTING": <SettingPage />,
          "GAME": <GamePage />
        }[mode];
      }}
    </AppContext.Consumer>
  </AppContextProvider>
);