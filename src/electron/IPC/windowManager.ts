import { BrowserWindow, BrowserView, ipcMain } from "electron";
import path from "path";

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
  openInBrowserView: openInBrowserView,
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
  await createMainWindow();
  // let win = await createMainWindow();
  // await win.addBrowserView(message.link);
  // win.setIpcMainView([windowControls, windowManager, systemInfo, updaterInfo]);
}

async function openInBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  // console.log(message.src);
  // console.log(customWindow);
  // customWindow.addBrowserView(message.src);
  // console.log(customWindow.getBrowserViews());
  setBrowserView(customWindow, message.src);
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

async function setBrowserView(win: BrowserWindow, link: string) {
  const [width, height] = win.getSize();
  const urlPreload = globals.get.preloadjs();

  let browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: urlPreload,
    },
  });

  win.setBrowserView(browserView);
  browserView.setBounds({
    x: 65, // 1
    y: 33, // 32
    width: width - 66, // -2
    height: height - 58, // -33
  });
  browserView.setAutoResize({
    width: true,
    height: true,
  });
  if (link) {
    browserView.webContents.loadURL(link);
  }

  setIpcMainView(browserView, [
    windowControls,
    windowManager,
    systemInfo,
    updaterInfo,
  ]);
}

async function setIpcMainView(browserView: BrowserView, api: Array<IPC>) {
  api.forEach(async (el) => el.initIpcMain(ipcMain, browserView));
}
