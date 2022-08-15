import windowManager from "./windowManager";
import windowControls from "./windowControls";

import { systemInfo } from "@el3um4s/ipc-for-electron-system-info";

import updaterInfo from "./updaterInfo";
import nodeAdodb from "./nodeAdodb";
import chokidarAPI from "./chokidarAPI";
import sqlite from "./sqlite";

const listAPI = [
  windowControls,
  windowManager,
  systemInfo,
  updaterInfo,
  nodeAdodb,
  chokidarAPI,
  sqlite,
];

export default listAPI;
