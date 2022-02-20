import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";
import { BrowserWindow } from "electron";

// ragiona come con l'updater (e guarda access-c3)
import path from "path";

import ADODB from "@el3um4s/node-adodb";

const nameAPI = "nodeAdodb";

// to Main
const validSendChannel: SendChannels = {
  open: open,
  query: query,
  execute: execute,
  transaction: transaction,
  schema: schema,
  listTables: listTables,
};

// from Main
const validReceiveChannel: string[] = ["queryResult", "listTablesResult"];

const nodeAdodb = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default nodeAdodb;

// Enter here the functions for ElectronJS

function open(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  //   mainWindow.webContents.send("getSystemInfo", result);
}

async function query(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { positionDB, sql } = message;

  const stringConnection = getStringConnection(positionDB);
  const result = await ADODB.open(stringConnection).query(sql);
  mainWindow.webContents.send("queryResult", result);
}

async function listTables(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { positionDB, sql } = message;

  const stringConnection = getStringConnection(positionDB);
  const result = await ADODB.open(stringConnection).schema(20);
  mainWindow.webContents.send("listTablesResult", result);
}

function execute(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  //   mainWindow.webContents.send("getSystemInfo", result);
}

function transaction(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  //   mainWindow.webContents.send("getSystemInfo", result);
}

function schema(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  //   mainWindow.webContents.send("getSystemInfo", result);
}

function getStringConnection(positionDB: string): string {
  const format = path.extname(positionDB);
  if (format.toLowerCase() == ".mdb") {
    return `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${positionDB};`;
  } else {
    return `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${positionDB};Persist Security Info=False;`;
  }
}

// async function _query(connection: ADODB.open, sql: string) {
//   try {
//     const users = await connection.query(sql);
//     console.log(JSON.stringify(users, null, 2));
//     return users;
//   } catch (error) {
//     console.error(error);
//     return error;
//   }
// }

async function _listTables(connection: ADODB.open): Promise<any[]> {
  // TABLE, LINK, ACCESS TABLE, SYSTEM TABLE, VIEW
  const result: Array<any> = [];
  try {
    const sc: Array<any> = await connection.schema(20);
    sc.forEach((table) => {
      const {
        TABLE_CATALOG,
        TABLE_SCHEMA,
        TABLE_NAME,
        TABLE_TYPE,
        TABLE_GUID,
        DESCRIPTION,
        TABLE_PROPID,
        DATE_CREATED,
        DATE_MODIFIED,
      } = table;
      const tableInfo = { TABLE_NAME, TABLE_TYPE, DATE_CREATED, DATE_MODIFIED };
      result.push(tableInfo);
    });
  } catch (error) {
    console.log(error);
  }
  return result;
}
