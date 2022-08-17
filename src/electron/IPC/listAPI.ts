import windowControls from "@el3um4s/ipc-for-electron-window-controls";
import systemInfo from "@el3um4s/ipc-for-electron-system-info";

import windowManager from "./windowManager";
import updaterInfo from "./updaterInfo";
import chokidarAPI from "./chokidarAPI";

const listAPI = [
  windowControls,
  windowManager,
  systemInfo,
  updaterInfo,
  chokidarAPI,
];

export default listAPI;
