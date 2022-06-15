import windowManager from "./windowManager";
import windowControls from "./windowControls";
import systemInfo from "./systemInfo";
import updaterInfo from "./updaterInfo";
import nodeAdodb from "./nodeAdodb";
import sqlite from "./sqlite";

const listAPI = [
  windowControls,
  windowManager,
  systemInfo,
  updaterInfo,
  nodeAdodb,
  sqlite,
];

export default listAPI;
