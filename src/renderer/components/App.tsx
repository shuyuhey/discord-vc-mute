import React from "react";
import { ipcRenderer } from "electron";

export const App: React.FC<{}> = () => {
  const [inMeeting, setInMeeting] = React.useState(false);

  return (
    <div>
      <button onClick={async () => {
        const result = ipcRenderer.sendSync('click-button', inMeeting);
        setInMeeting(result);
      }}>
        {!inMeeting ? 'Start Meeting' : 'Stop Meeting'}
      </button>
    </div>
  );
};