import { app, BrowserWindow, BrowserView, ipcMain } from "electron";
import path from "path";
import EventEmitter from "events";
import IPC from "./IPC/General/IPC";

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
        nativeWindowOpen: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    window.loadURL(url);
    window.once("ready-to-show", () => {
      window.show();
    });

    this.window = window;
    return window;
  }

  async setIpcMain(api: Array<IPC>) {
    api.forEach(async (el) => await el.initIpcMain(ipcMain, this.window));
  }

  async addBrowserView(link: string = "") {
    const [width, height] = this.window.getSize();

    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        nativeWindowOpen: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    this.window.setBrowserView(this.browserView);
    this.browserView.setBounds({
      x: 65, // 1
      y: 32,
      width: width - 66, // -2
      height: height - 57, // -33
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
        nativeWindowOpen: true,
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
