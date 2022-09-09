import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow } from "electron";

import createWindow from "../createWindow";
import ElectronWindow from "@el3um4s/electron-window";

import globals from "../globals";

const nameAPI = "windowManager";

// to Main
const validSendChannel: SendChannels = {
  openInNewWindow: openInNewWindow,
  openDevTools: openDevTools,
};

// from Main
const validReceiveChannel: string[] = [];

const windowManager = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default windowManager;

// Enter here the functions for ElectronJS

async function createMainWindow() {
  let electronWindow: ElectronWindow;

  const url = globals.get.mainUrl();
  const preload = globals.get.preloadjs();

  electronWindow = await createWindow({
    url,
    preload,
    themeSource: "light",
    settings: {
      x: Math.floor(Math.random() * 64),
      y: Math.floor(Math.random() * 64),
    },
  });
  return electronWindow;
}

async function openInNewWindow(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  await createMainWindow();
}

async function openDevTools(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  customWindow.webContents.openDevTools();
}
