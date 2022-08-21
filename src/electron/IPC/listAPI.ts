import windowControls from "@el3um4s/ipc-for-electron-window-controls";
import systemInfo from "@el3um4s/ipc-for-electron-system-info";
import chokidar from "@el3um4s/ipc-for-electron-chokidar";
import autoUpdater from "@el3um4s/ipc-for-electron-auto-updater";

import windowManager from "./windowManager";

const listAPI = [
  windowControls,
  windowManager,
  systemInfo,
  autoUpdater,
  chokidar,
];

export default listAPI;
