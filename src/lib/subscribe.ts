import { ipcRenderer, IpcRendererEvent } from "electron";

type Callback<T> = (event: IpcRendererEvent, arg: T) => void

export function subscribe<T>(name: string, callback: Callback<T>): Function {
  ipcRenderer.on(name, callback);

  return () => {
    ipcRenderer.removeListener(name, callback);
  };
}

export function invoke<T>(name: string, arg?: T) {
  return ipcRenderer.invoke(name, arg);
}