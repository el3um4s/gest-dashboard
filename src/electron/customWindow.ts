import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  nativeTheme,
} from "electron";
import path from "path";
import EventEmitter from "events";
import IPC from "./IPC/General/IPC";

import * as globals from "./globals";

const appName = "gest-dashboard";

const defaultSettings = {
  title: "gest-dashboard",
  width: 854,
  height: 480,
  frame: false,
  backgroundColor: "#FFF",
};

class CustomWindow {
  window!: BrowserWindow;
  settings: { [key: string]: any };
  onEvent: EventEmitter = new EventEmitter();

  browserView!: BrowserView;

  constructor(settings: { [key: string]: any } | null = null) {
    this.settings = settings
      ? { ...defaultSettings, ...settings }
      : { ...defaultSettings };
  }

  createWindow(url: string) {
    let settings = { ...this.settings };
    app.name = appName;
    const iconPath = path.join(__dirname, "icon.png");
    let window = new BrowserWindow({
      ...settings,
      icon: iconPath,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    window.loadURL(url);

    nativeTheme.themeSource = "light";

    window.once("ready-to-show", () => {
      window.show();
    });

    this.window = window;
    return window;
  }

  async setIpcMain(api: Array<IPC>) {
    api.forEach(async (el) => el.initIpcMain(ipcMain, this.window));
  }

  async addBrowserView(link: string = "") {
    const [width, height] = this.window.getSize();
    const browserViewBounds = globals.get.browserViewBounds();

    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    this.window.setBrowserView(this.browserView);
    this.browserView.setBounds({
      x: browserViewBounds.x, // 1
      y: browserViewBounds.y,
      width: width - browserViewBounds.widthDelta, // -2
      height: height - browserViewBounds.heightDelta, // -33
    });
    this.browserView.setAutoResize({
      width: true,
      height: true,
    });
    if (link != "") {
      this.browserView.webContents.loadURL(link);
    }
  }

  async addBrowserViewHidden(link: string = "") {
    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    this.window.setBrowserView(this.browserView);

    this.browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    this.browserView.setAutoResize({
      width: false,
      height: false,
    });

    if (link != "") {
      this.browserView.webContents.loadURL(link);
    }
  }

  async setIpcMainView(api: Array<IPC>) {
    api.forEach(async (el) => el.initIpcMain(ipcMain, this.browserView));
  }
}

export default CustomWindow;
