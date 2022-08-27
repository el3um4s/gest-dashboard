import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  nativeTheme,
} from "electron";

import path from "path";
import EventEmitter from "events";

import autoUpdater from "@el3um4s/ipc-for-electron-auto-updater";
import { IPC } from "@el3um4s/ipc-for-electron";

interface CreateWindow {
  url: string;
  iconPath?: string;
  preload?: string;
  themeSource?: "system" | "light" | "dark";
}

interface CreateBrowserView {
  url?: string;
  preload?: string;
  bounds?: BrowserViewBounds;
}

interface BrowserViewBounds {
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  show?: boolean;
}

const appName = "appName";

const defaultSettings = {
  title: appName,
  width: 854,
  height: 480,
  frame: false,
  backgroundColor: "#FFF",
};

class ElectronWindow {
  window!: BrowserWindow;
  settings: { [key: string]: any };
  onEvent: EventEmitter = new EventEmitter();
  preload!: string;

  browserView!: BrowserView;

  constructor(settings: { [key: string]: any } | null = null) {
    this.settings = settings
      ? { ...defaultSettings, ...settings }
      : { ...defaultSettings };
  }

  createWindow(options?: CreateWindow) {
    const {
      url = "",
      iconPath = "icon.png",
      preload = path.join(__dirname, "preload.js"),
      themeSource = "system",
    } = options ? options : {};

    this.preload = preload;

    let settings = { ...this.settings };
    app.name = appName;

    let window = new BrowserWindow({
      ...settings,
      icon: path.join(__dirname, iconPath),
      show: false,
      webPreferences: {
        preload,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
      },
    });

    window.loadURL(url);

    nativeTheme.themeSource = themeSource;

    window.once("ready-to-show", () => {
      window.show();
    });

    this.window = window;
    return window;
  }

  async setIpcMain(api: Array<IPC>) {
    api.forEach(async (el) => el.initIpcMain(ipcMain, this.window));
  }

  async addBrowserView(options?: CreateBrowserView) {
    const { url = "", preload = this.preload } = options ? options : {};
    const {
      bounds = {
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        show: true,
      },
    } = options ? options : {};
    const {
      paddingLeft = 0,
      paddingTop = 0,
      paddingRight = 0,
      paddingBottom = 0,
      show = true,
    } = bounds;

    const [width, height] = this.window.getSize();

    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload,
      },
    });

    this.window.setBrowserView(this.browserView);

    if (show) {
      this.browserView.setBounds({
        x: paddingLeft,
        y: paddingTop,
        width: width - paddingRight,
        height: height - paddingBottom,
      });

      this.browserView.setAutoResize({
        width: true,
        height: true,
      });
    } else {
      this.browserView.setBounds({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });

      this.browserView.setAutoResize({
        width: false,
        height: false,
      });
    }

    if (url != "") {
      this.browserView.webContents.loadURL(url);
    }
  }

  async addBrowserViewHidden(options?: CreateBrowserView) {
    const bounds = {
      paddingLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      show: false,
    };
    this.addBrowserView({ ...options, bounds });
  }

  async setIpcMainView(api: Array<IPC>) {
    api.forEach(async (el) => el.initIpcMain(ipcMain, this.browserView));
  }

  async addAutoUpdater() {
    autoUpdater.initAutoUpdater(this.window);
    autoUpdater.checkForUpdates();
  }
}

export default ElectronWindow;
