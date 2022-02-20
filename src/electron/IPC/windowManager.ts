import { BrowserWindow, BrowserView, ipcMain } from "electron";

import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";

import CustomWindow from "../customWindow";

import windowControls from "./windowControls";
import systemInfo from "./systemInfo";
import updaterInfo from "./updaterInfo";
import nodeAdodb from "./nodeAdodb";

import * as globals from "../globals";

const nameAPI = "windowManager";

// to Main
const validSendChannel: SendChannels = {
  openInNewWindow: openInNewWindow,
  openInBrowserView: openInBrowserView,
  showBrowserView: showBrowserView,
  removeBrowserView: removeBrowserView,
};

// from Main
const validReceiveChannel: string[] = ["showBrowserView"];

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
}

async function openInBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
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
    nodeAdodb,
  ]);
  return customWindow;
}

async function showBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();

  if (message.show) {
    const present = browserView ? "yes" : "no";
    customWindow.webContents.send("showBrowserView", {
      present,
    });
  }
  if (browserView && message.show) {
    const [width, height] = customWindow.getSize();
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
  } else if (browserView && !message.show) {
    browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    browserView.setAutoResize({
      width: false,
      height: false,
    });
  }
}

async function removeBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();
  if (browserView) {
    customWindow.removeBrowserView(browserView);
  }
}

async function setBrowserView(win: BrowserWindow, link: string) {
  const browserView = win.getBrowserView();
  if (browserView) {
    browserView.webContents.loadURL(link);
  } else {
    addNewBrowserView(win, link);
  }
}

async function addNewBrowserView(win: BrowserWindow, link: string) {
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
    nodeAdodb,
  ]);
}

async function setIpcMainView(browserView: BrowserView, api: Array<IPC>) {
  api.forEach(async (el) => el.initIpcMain(ipcMain, browserView));
}
