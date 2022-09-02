import ElectronWindow from "@el3um4s/electron-window";
import path from "path";

import listAPI from "./IPC/listAPI";

const createWindow = async (options: {
  url: string;
  preload: string;
  themeSource?: "system" | "light" | "dark";
  settings?: Electron.BrowserWindowConstructorOptions;
}): Promise<ElectronWindow> => {
  let window: ElectronWindow;

  const { url, themeSource = "system", preload } = options;

  const settings = {
    ...options?.settings,
    title: "GEST DASHBOARD",
  };
  window = new ElectronWindow(settings);

  window.createWindow({
    url,
    themeSource,
    preload,
    iconPath: path.join(__dirname, "icon.png"),
  });

  await window.setIpcMain(listAPI);

  await window.addBrowserViewHidden();
  await window.setIpcMainView(listAPI);

  window.addAutoUpdater();
  return window;
};

export default createWindow;
