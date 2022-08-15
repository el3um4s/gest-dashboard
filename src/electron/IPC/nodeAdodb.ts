import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow } from "electron";

// ragiona come con l'updater (e guarda access-c3)
import path from "path";

import ADODB from "@el3um4s/node-adodb";
import { getTypeDescription } from "./NodeAdodb/listTypeFieldEnum";

const nameAPI = "nodeAdodb";

// to Main
const validSendChannel: SendChannels = {
  query: query,
  execute: execute,
  transaction: transaction,
  schema: schema,
  listTables: listTables,
  schemaTable: schemaTable,
};

// from Main
const validReceiveChannel: string[] = [
  "queryResult",
  "listTablesResult",
  "schemaResult",
  "transactionResult",
  "executeResult",
  "schemaTableResult",
];

const nodeAdodb = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default nodeAdodb;

// Enter here the functions for ElectronJS

async function query(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { source, sql } = message;

  const stringConnection = getStringConnection(source);
  const result = await ADODB.open(stringConnection).query(sql);
  mainWindow.webContents.send("queryResult", result);
}

async function schema(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { source, type, criteria, id } = message;
  const stringConnection = getStringConnection(source);
  const result = await ADODB.open(stringConnection).schema(type, criteria, id);
  mainWindow.webContents.send("schemaResult", result);
}

async function listTables(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { source } = message;

  const stringConnection = getStringConnection(source);
  const result = await ADODB.open(stringConnection).schema(20);
  mainWindow.webContents.send("listTablesResult", result);
}

async function schemaTable(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { source, tableName } = message;

  const stringConnection = getStringConnection(source);
  const columns: Array<any> = await ADODB.open(stringConnection).schema(4, [
    null,
    null,
    tableName,
  ]);
  const result = columns.map((column) => {
    const { DATA_TYPE } = column;
    const DATA_TYPE_DESCRIPTION = getTypeDescription(DATA_TYPE);
    return { ...column, DATA_TYPE_DESCRIPTION };
  });
  mainWindow.webContents.send("schemaTableResult", result);
}

async function transaction(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { source, sql } = message;
  const stringConnection = getStringConnection(source);
  const result = await ADODB.open(stringConnection).transaction(sql);
  mainWindow.webContents.send("transactionResult", result);
}

async function execute(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const { source, sql, scalar } = message;
  const stringConnection = getStringConnection(source);
  const result = await ADODB.open(stringConnection).execute(sql, scalar);
  mainWindow.webContents.send("executeResult", result);
}

function getStringConnection(positionDB: string): string {
  const format = path.extname(positionDB);
  if (format.toLowerCase() == ".mdb") {
    return `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${positionDB};`;
  } else {
    return `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${positionDB};Persist Security Info=False;`;
  }
}

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
