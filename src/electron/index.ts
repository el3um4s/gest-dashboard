import { app } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import { pathToFileURL } from "node:url";

import CustomWindow from "./customWindow";
import updaterInfo from "./IPC/updaterInfo";
import listAPI from "./IPC/listAPI";
import * as globals from "./globals";
import ADODB from "@el3um4s/node-adodb";

if (app.isPackaged) {
  ADODB.PATH = "./resources/adodb.js";
}

const mainURLPATH = pathToFileURL(path.join(__dirname, "www", "index.html"));
const preloadjsPATH = pathToFileURL(path.join(__dirname, "www", "index.html"));

globals.set.mainURL(mainURLPATH.href);
// globals.set.preloadjs(preloadjsPATH.href);

// globals.set.mainURL(path.join(__dirname, "www", "index.html"));
globals.set.preloadjs(path.join(__dirname, "preload.js"));

require("electron-reload")(__dirname);

let mainWindow: CustomWindow;

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendArgument("disable-gpu");
app.commandLine.appendSwitch("enable-experimental-web-platform-features");

if (process.platform === "win32") {
  (async () => {
    const FOUR_HOURS = 1000 * 60 * 60 * 4;
    setInterval(async () => {
      await autoUpdater.checkForUpdates();
    }, FOUR_HOURS);
  })();
}

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

  await mainWindow.setIpcMain(listAPI);

  mainWindow.addBrowserViewHidden();
  mainWindow.setIpcMainView(listAPI);

  if (process.platform === "win32") {
    updaterInfo.initAutoUpdater(autoUpdater, mainWindow.window);
    autoUpdater.checkForUpdates();
  }
}

autoUpdater.on("update-available", (info) => {
  console.log("autoupdater-update-available");
  mainWindow.window.webContents.send("autoUpdateAvailable", info);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("autoupdater-update-available");
  mainWindow.window.webContents.send("autoUpdateDownloaded", info);
});
