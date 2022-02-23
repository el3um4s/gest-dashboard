import { app } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import CustomWindow from "./customWindow";

import systemInfo from "./IPC/systemInfo";
import updaterInfo from "./IPC/updaterInfo";
import windowControls from "./IPC/windowControls";
import windowManager from "./IPC/windowManager";
import nodeAdodb from "./IPC/nodeAdodb";

import * as globals from "./globals";

import ADODB from "@el3um4s/node-adodb";

if (app.isPackaged) {
  ADODB.PATH = "./resources/adodb.js";
}

globals.set.mainURL(path.join(__dirname, "www", "index.html"));
globals.set.preloadjs(path.join(__dirname, "preload.js"));

require("electron-reload")(__dirname);

let mainWindow: CustomWindow;

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendArgument("disable-gpu");

(async () => {
  const FOUR_HOURS = 1000 * 60 * 60 * 4;
  setInterval(async () => {
    await autoUpdater.checkForUpdates();
  }, FOUR_HOURS);
})();

app.on("ready", async () => {
  await createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function createMainWindow() {
  const settings = {
    title: "GEST DASHBOARD",
  };
  mainWindow = new CustomWindow(settings);
  const urlPage = globals.get.mainUrl();
  mainWindow.createWindow(urlPage);

  await mainWindow.setIpcMain([
    systemInfo,
    updaterInfo,
    windowControls,
    windowManager,
    nodeAdodb,
  ]);

  mainWindow.addBrowserViewHidden();
  mainWindow.setIpcMainView([
    systemInfo,
    updaterInfo,
    windowControls,
    windowManager,
    nodeAdodb,
  ]);

  updaterInfo.initAutoUpdater(autoUpdater, mainWindow.window);

  autoUpdater.checkForUpdates();
}

autoUpdater.on("update-available", (info) => {
  console.log("autoupdater-update-available");
  mainWindow.window.webContents.send("autoUpdateAvailable", info);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("autoupdater-update-available");
  mainWindow.window.webContents.send("autoUpdateDownloaded", info);
});
