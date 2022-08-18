import ElectronWindow from "./electronWindow";

import listAPI from "./IPC/listAPI";

const createWindow = async (options: {
  url: string;
  preload: string;
  themeSource?: "system" | "light" | "dark";
}): Promise<ElectronWindow> => {
  let window: ElectronWindow;

  const { url, themeSource = "system", preload } = options;

  const settings = {
    title: "GEST DASHBOARD",
  };
  window = new ElectronWindow(settings);

  window.createWindow({ url, themeSource, preload });

  await window.setIpcMain(listAPI);

  await window.addBrowserViewHidden();
  await window.setIpcMainView(listAPI);

  window.addAutoUpdater();
  return window;
};

export default createWindow;
