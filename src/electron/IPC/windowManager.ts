import { BrowserWindow } from "electron";

import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";

import CustomWindow from "../customWindow";

import windowControls from "./windowControls";
import systemInfo from "./systemInfo";
import updaterInfo from "./updaterInfo";

import * as globals from "../globals";

const nameAPI = "windowManager";

// to Main
const validSendChannel: SendChannels = {
  openInNewWindow: openInNewWindow,
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

async function openInNewWindow(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  let win = await createMainWindow();
  // await win.addBrowserView(message.link);
  // win.setIpcMainView([windowControls, windowManager, systemInfo, updaterInfo]);
}

async function createMainWindow() {
  let customWindow: CustomWindow;
  const settings = {
    title: "-",
    x: Math.floor(Math.random() * 64),
    y: Math.floor(Math.random() * 64),
  };

  const urlPage = globals.get.mainUrl();
  customWindow = new CustomWindow(settings);
  customWindow.createWindow(urlPage);

  await customWindow.setIpcMain([
    windowControls,
    windowManager,
    systemInfo,
    updaterInfo,
  ]);
  return customWindow;
}
