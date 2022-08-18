import { app } from "electron";
import path from "path";
import { pathToFileURL } from "node:url";
require("electron-reload")(__dirname);

import createWindow from "./createWindow";

import * as globals from "./globals";
// import ADODB from "@el3um4s/node-adodb";

// if (app.isPackaged) {
//   ADODB.PATH = "./resources/adodb.js";
// }

const mainURLPATH = pathToFileURL(path.join(__dirname, "www", "index.html"));

globals.set.mainURL(mainURLPATH.href);
globals.set.preloadjs(path.join(__dirname, "preload.js"));

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendArgument("disable-gpu");
app.commandLine.appendSwitch("enable-experimental-web-platform-features");

let mainWindow;

app.on("ready", async () => {
  const url = globals.get.mainUrl();
  const preload = globals.get.preloadjs();
  mainWindow = await createWindow({ url, themeSource: "light", preload });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
