import React from "react";
import { AppContext, AppContextProvider } from "./AppContext";
import { SettingPage } from "../pages/SettingPage";
import { GamePage } from "../pages/GamePage";
import { TokenPage } from "../pages/TokenPage";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const App: React.FC<{}> = () => (
  <Container>
    <AppContextProvider>
      <AppContext.Consumer>
        {({ mode }) => {
          return {
            "SPLASH": null,
            "TOKEN": <TokenPage />,
            "SETTING": <SettingPage />,
            "GAME": <GamePage />
          }[mode];
        }}
      </AppContext.Consumer>
    </AppContextProvider>
  </Container>
);