import windowControls from "@el3um4s/ipc-for-electron-window-controls";
import systemInfo from "@el3um4s/ipc-for-electron-system-info";
import chokidar from "@el3um4s/ipc-for-electron-chokidar";

import windowManager from "./windowManager";
import updaterInfo from "./updaterInfo";

const listAPI = [
  windowControls,
  windowManager,
  systemInfo,
  updaterInfo,
  chokidar,
];

export default listAPI;
