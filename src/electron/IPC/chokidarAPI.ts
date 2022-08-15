import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow } from "electron";

import { toTry } from "@el3um4s/to-try";
import chokidar from "chokidar";

const nameAPI = "chokidarAPI";

// to Main
const validSendChannel: SendChannels = {
  watchFolder: watchFolder,
  watchFile: watchFile,
};

// from Main
const validReceiveChannel: string[] = ["folderChanged", "fileChanged"];

const chokidarAPI = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default chokidarAPI;

const sendMessage = (
  watcher: chokidar.FSWatcher,
  mainWindow: BrowserWindow,
  nameMessage: string,
  message: { path: string; eventName: string; nameWatcher: string }
) => {
  const [ok, ko] = toTry(() =>
    mainWindow.webContents.send(nameMessage, message)
  );
  if (ko) {
    watcher.close();
  }
};

async function watchFolder(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { folderPath, nameWatcher } = message;
  const watcher = chokidar.watch(folderPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    ignoreInitial: true,
  });

  watcher
    .on("add", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "add",
        nameWatcher,
      })
    )
    .on("change", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "change",
        nameWatcher,
      })
    )
    .on("unlink", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "unlink",
        nameWatcher,
      })
    )
    .on("addDir", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "addDir",
        nameWatcher,
      })
    )
    .on("unlinkDir", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "unlinkDir",
        nameWatcher,
      })
    );
}

function watchFile(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { filePath, nameWatcher } = message;
  const watcher = chokidar.watch(filePath, { ignoreInitial: true });

  watcher
    .on("add", (path) =>
      sendMessage(watcher, mainWindow, "fileChanged", {
        path,
        eventName: "add",
        nameWatcher,
      })
    )
    .on("change", (path) =>
      sendMessage(watcher, mainWindow, "fileChanged", {
        path,
        eventName: "change",
        nameWatcher,
      })
    )
    .on("unlink", (path) =>
      sendMessage(watcher, mainWindow, "fileChanged", {
        path,
        eventName: "unlink",
        nameWatcher,
      })
    );
}
