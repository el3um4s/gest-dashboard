import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow, BrowserView, ipcMain } from "electron";

import CustomWindow from "../customWindow";

import listAPI from "./listAPI";

import * as globals from "../globals";

const nameAPI = "windowManager";

// to Main
const validSendChannel: SendChannels = {
  openInNewWindow: openInNewWindow,
  openInBrowserView: openInBrowserView,
  showBrowserView: showBrowserView,
  removeBrowserView: removeBrowserView,
  openDevTools: openDevTools,
  openBrowserViewDevTools: openBrowserViewDevTools,
  printBrowserView: printBrowserView,
  resizeBrowserViewToMaximized: resizeBrowserViewToMaximized,
  resizeBrowserViewToUnMaximized: resizeBrowserViewToUnMaximized,
  goBackBrowserView: goBackBrowserView,
  goForwardBrowserView: goForwardBrowserView,
  reloadCurrentPageBrowserView: reloadCurrentPageBrowserView,
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

  await customWindow.setIpcMain(listAPI);
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
    const browserViewBounds = globals.get.browserViewBounds();

    browserView.setBounds({
      x: browserViewBounds.x, // 1
      y: browserViewBounds.y, // 32
      width: width - browserViewBounds.widthDelta, // -2
      height: height - browserViewBounds.heightDelta, // -33
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

async function resizeBrowserViewToMaximized(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();

  if (browserView && browserView.getBounds().width > 0) {
    const [width, height] = customWindow.getSize();
    const browserViewBounds = globals.get.browserViewBounds();
    browserView.setBounds({
      x: browserViewBounds.x,
      y: browserViewBounds.y,
      width: width - browserViewBounds.widthDelta - 16,
      height: height - browserViewBounds.heightDelta - 16,
    });
  }
}

async function resizeBrowserViewToUnMaximized(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();

  if (browserView && browserView.getBounds().width > 0) {
    const [width, height] = customWindow.getSize();
    const browserViewBounds = globals.get.browserViewBounds();
    browserView.setBounds({
      x: browserViewBounds.x,
      y: browserViewBounds.y,
      width: width - browserViewBounds.widthDelta,
      height: height - browserViewBounds.heightDelta,
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

async function openDevTools(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  customWindow.webContents.openDevTools();
}

async function openBrowserViewDevTools(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();
  if (browserView) {
    browserView.webContents.openDevTools();
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

async function printBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();
  if (browserView) {
    browserView.webContents.print();
  }
}

async function addNewBrowserView(win: BrowserWindow, link: string) {
  const [width, height] = win.getSize();
  const urlPreload = globals.get.preloadjs();

  let browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
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

  setIpcMainView(browserView, listAPI);
}

async function setIpcMainView(browserView: BrowserView, api: Array<IPC>) {
  api.forEach(async (el) => el.initIpcMain(ipcMain, browserView));
}

async function goBackBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();
  if (browserView && browserView?.webContents?.canGoBack()) {
    browserView.webContents.goBack();
  }
}

async function goForwardBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();
  if (browserView && browserView?.webContents?.canGoForward()) {
    browserView.webContents.goForward();
  }
}

async function reloadCurrentPageBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const browserView = customWindow.getBrowserView();
  if (browserView) {
    browserView.webContents.reload();
  }
}
