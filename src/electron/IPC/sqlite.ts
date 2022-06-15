import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";
import { BrowserWindow, dialog, OpenDialogSyncOptions } from "electron";

import path from "path";
import sqlite3 from "sqlite3";

import { getOriginPrivateDirectory } from "native-file-system-adapter";
import nodeAdapter from "native-file-system-adapter/src/adapters/node.js";
// https://github.com/jimmywarting/native-file-system-adapter

import { toTry } from "@el3um4s/to-try";

import { statSync, unlinkSync } from "node:fs";

const nameAPI = "sqlite";

// to Main
const validSendChannel: SendChannels = {
  testSQLite: testSQLite,
  loadHistoryBrowser: loadHistoryBrowser,
};

// from Main
const validReceiveChannel: string[] = ["loadHistoryBrowser"];

const sqlite = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default sqlite;

async function testSQLite(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const options = {
    filters: [
      {
        name: "Bookmark (Database SQLite)",
        extensions: ["bookmark", "sqlite3", "db3", "sqlite", "db"],
      },
    ],
  };
  const savePath = await dialog.showSaveDialog(mainWindow, options);
  if (!savePath.canceled && savePath.filePath) {
    const filePath = savePath.filePath;
    console.log(savePath);

    const { historyBrowser } = message;
    const [fileExists] = toTry(() => statSync(filePath));

    if (fileExists) {
      unlinkSync(filePath);
    }

    console.log("testSQLite");
    const db = new sqlite3.Database(filePath);
    db.serialize(() => {
      db.run(
        "CREATE TABLE historyBrowser (url, title, note, starred, folderHandle)"
      );
      const stmtHB = db.prepare(
        "INSERT INTO historyBrowser (url, title, note, starred, folderHandle) VALUES($url, $title, $note, $starred, $folderHandle)"
      );
      historyBrowser.forEach((el: any) => {
        const { url, title, note, starred } = el;
        const folderHandle = el?.folderHandle ? el.folderHandle : null;
        stmtHB.run({
          $url: url,
          $title: title,
          $note: note,
          $starred: starred,
          $folderHandle: folderHandle,
        });
      });
      stmtHB.finalize();

      db.run("CREATE TABLE lorem (info TEXT)");

      // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
      // for (let i = 0; i < 10; i++) {
      //   stmt.run("Ipsum " + i);
      // }
      // stmt.finalize();

      // db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
      //   console.log(row.id, " : ", row.info);
      // });

      db.each(
        "SELECT rowid AS id, url, title, note, starred, folderHandle FROM historyBrowser",
        (err, row) => {
          console.log(row.id, " : ", row.url);
        }
      );
    });

    db.close();
  }
}

async function loadHistoryBrowser(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const options: OpenDialogSyncOptions = {
    filters: [
      {
        name: "Bookmark (Database SQLite)",
        extensions: ["bookmark", "db", "sqlite3", "sqlite", "db3"],
      },
    ],
    properties: ["openFile"],
  };

  const loadFile = dialog.showOpenDialogSync(mainWindow, options);

  if (loadFile && loadFile.length > 0) {
    console.log(loadFile[0]);

    const db = new sqlite3.Database(loadFile[0]);
    // db.serialize(() => {
    // db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
    //   console.log(row.id, " : ", row.info);
    // });

    db.each(
      "SELECT rowid AS id, url, title, note, starred, folderHandle FROM historyBrowser",
      async (err, row) => {
        console.log(row.id, " : ", row.url);
        if (row?.folderHandle) {
          console.log(row.folderHandle);
          // const dirHandler = await getOriginPrivateDirectory(
          //   nodeAdapter,
          //   row.url
          // );
          // console.log(dirHandler);
          // const nodeDirHandle = await getOriginPrivateDirectory(nodeAdapter, './real-dir')
        }
      }
    );

    db.all("SELECT * FROM historyBrowser", (err, rows) => {
      console.log(rows);
      // mainWindow.webContents.send("loadHistoryBrowser", rows);
    });
    // });

    db.close();
  }
}
