// import { generateContextBridge } from "./IPC/General/contextBridge";
import { generateContextBridge } from "@el3um4s/ipc-for-electron";

import listAPI from "./IPC/listAPI";

generateContextBridge(listAPI, "api");
