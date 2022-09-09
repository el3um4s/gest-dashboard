import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow, BrowserView, ipcMain } from "electron";

import createWindow from "../createWindow";
// import ElectronWindow from "../electronWindow";
import ElectronWindow from "@el3um4s/electron-window";

// import listAPI from "./listAPI";

import * as globals from "../globals";

const nameAPI = "windowManager";

// to Main
const validSendChannel: SendChannels = {
  openInNewWindow: openInNewWindow,
  // openInBrowserView: openInBrowserView,
  // showBrowserView: showBrowserView,
  // removeBrowserView: removeBrowserView,
  openDevTools: openDevTools,
  // openBrowserViewDevTools: openBrowserViewDevTools,
  // printBrowserView: printBrowserView,
  // resizeBrowserViewToMaximized: resizeBrowserViewToMaximized,
  // resizeBrowserViewToUnMaximized: resizeBrowserViewToUnMaximized,
  // goBackBrowserView: goBackBrowserView,
  // goForwardBrowserView: goForwardBrowserView,
  // reloadCurrentPageBrowserView: reloadCurrentPageBrowserView,
};

// from Main
// const validReceiveChannel: string[] = ["showBrowserView"];
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

// move to custom IPC - RENDERER
async function openDevTools(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  customWindow.webContents.openDevTools();
}

// // move to custom IPC - RENDERER
// async function openInBrowserView(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   setBrowserView(customWindow, message.src);
// }

// // refractor to use in the renderer
// async function showBrowserView(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();

//   if (message.show) {
//     const present = browserView ? "yes" : "no";
//     customWindow.webContents.send("showBrowserView", {
//       present,
//     });
//   }
//   if (browserView && message.show) {
//     const [width, height] = customWindow.getSize();
//     const browserViewBounds = globals.get.browserViewBounds();

//     browserView.setBounds({
//       x: browserViewBounds.x, // 1
//       y: browserViewBounds.y, // 32
//       width: width - browserViewBounds.widthDelta, // -2
//       height: height - browserViewBounds.heightDelta, // -33
//     });
//     browserView.setAutoResize({
//       width: true,
//       height: true,
//     });
//   } else if (browserView && !message.show) {
//     browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
//     browserView.setAutoResize({
//       width: false,
//       height: false,
//     });
//   }
// }

// // refractor to use in the renderer
// async function resizeBrowserViewToMaximized(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();

//   if (browserView && browserView.getBounds().width > 0) {
//     const [width, height] = customWindow.getSize();
//     const browserViewBounds = globals.get.browserViewBounds();
//     browserView.setBounds({
//       x: browserViewBounds.x,
//       y: browserViewBounds.y,
//       width: width - browserViewBounds.widthDelta - 16,
//       height: height - browserViewBounds.heightDelta - 16,
//     });
//   }
// }

// // refractor to use in the renderer
// async function resizeBrowserViewToUnMaximized(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();

//   if (browserView && browserView.getBounds().width > 0) {
//     const [width, height] = customWindow.getSize();
//     const browserViewBounds = globals.get.browserViewBounds();
//     browserView.setBounds({
//       x: browserViewBounds.x,
//       y: browserViewBounds.y,
//       width: width - browserViewBounds.widthDelta,
//       height: height - browserViewBounds.heightDelta,
//     });
//   }
// }

// // move to custom IPC - RENDERER
// async function removeBrowserView(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();
//   if (browserView) {
//     customWindow.removeBrowserView(browserView);
//   }
// }

// // move to custom IPC - RENDERER
// async function openBrowserViewDevTools(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();
//   if (browserView) {
//     browserView.webContents.openDevTools();
//   }
// }

// // move to custom IPC - RENDERER
// async function setBrowserView(win: BrowserWindow, link: string) {
//   const browserView = win.getBrowserView();
//   if (browserView) {
//     browserView.webContents.loadURL(link);
//   }
//   // else {
//   //   addNewBrowserView(win, link);
//   // }
// }

// // move to custom IPC - RENDERER
// async function printBrowserView(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();
//   if (browserView) {
//     browserView.webContents.print();
//   }
// }

// // async function addNewBrowserView(win: BrowserWindow, link: string) {
// //   console.log("addNewBrowserView");
// //   console.log(win);
// //   console.log("addNewBrowserView");
// //   const [width, height] = win.getSize();
// //   const urlPreload = globals.get.preloadjs();

// //   let browserView = new BrowserView({
// //     webPreferences: {
// //       nodeIntegration: false,
// //       contextIsolation: true,
// //       sandbox: false,
// //       preload: urlPreload,
// //     },
// //   });

// //   win.setBrowserView(browserView);
// //   browserView.setBounds({
// //     x: 65, // 1
// //     y: 33, // 32
// //     width: width - 66, // -2
// //     height: height - 58, // -33
// //   });
// //   browserView.setAutoResize({
// //     width: true,
// //     height: true,
// //   });
// //   if (link) {
// //     browserView.webContents.loadURL(link);
// //   }

// //   setIpcMainView(browserView, listAPI);
// // }

// // async function setIpcMainView(browserView: BrowserView, api: Array<IPC>) {
// //   api.forEach(async (el) => el.initIpcMain(ipcMain, browserView));
// // }

// // move to custom IPC - RENDERER
// async function goBackBrowserView(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();
//   if (browserView && browserView?.webContents?.canGoBack()) {
//     browserView.webContents.goBack();
//   }
// }

// // move to custom IPC - RENDERER
// async function goForwardBrowserView(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();
//   if (browserView && browserView?.webContents?.canGoForward()) {
//     browserView.webContents.goForward();
//   }
// }

// // move to custom IPC - RENDERER
// async function reloadCurrentPageBrowserView(
//   customWindow: BrowserWindow,
//   event: Electron.IpcMainEvent,
//   message: any
// ) {
//   const browserView = customWindow.getBrowserView();
//   if (browserView) {
//     browserView.webContents.reload();
//   }
// }
