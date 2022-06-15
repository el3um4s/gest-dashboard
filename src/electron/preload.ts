import { generateContextBridge } from "./IPC/General/contextBridge";

import systemInfo from "./IPC/systemInfo";
import updaterInfo from "./IPC/updaterInfo";
import windowControls from "./IPC/windowControls";
import windowManager from "./IPC/windowManager";
import nodeAdodb from "./IPC/nodeAdodb";
import sqlite from "./IPC/sqlite";

import listAPI from "./IPC/listAPI";

generateContextBridge(listAPI);
