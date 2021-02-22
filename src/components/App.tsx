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

const OfflineAlert = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  padding: 2px;
  display: flex;
  justify-content: center;
  background: var(--fatal);
  color: var(--gray-9);
  font-weight: 500;
  font-size: 0.5rem;
`;

export const App: React.FC<{}> = () => {
  const [onLine, setOnLine] = React.useState(navigator.onLine);

  const alertOnlineStatus = React.useCallback(() => {
    setOnLine(navigator.onLine);
  }, [navigator.onLine, setOnLine]);

  React.useEffect(() => {
    window.addEventListener('online', alertOnlineStatus);
    window.addEventListener('offline', alertOnlineStatus);

    return () => {
      window.removeEventListener('online', alertOnlineStatus);
      window.removeEventListener('offline', alertOnlineStatus);
    };
  }, []);

  return (
    <Container>
      {!onLine && (
        <OfflineAlert>
          インターネット接続がありません
        </OfflineAlert>
      )}

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
};