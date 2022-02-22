import ADODB from "@el3um4s/node-adodb";
import path from "path";

export function open(positionDB: string): ADODB.open {
  const stringConnection = getStringConnection(positionDB);
  const connection = ADODB.open(stringConnection);
  return connection;
}

function getStringConnection(positionDB: string): string {
  const format = path.extname(positionDB);
  if (format.toLowerCase() == ".mdb") {
    return `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${positionDB};`;
  } else {
    return `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${positionDB};Persist Security Info=False;`;
  }
}

export async function getListTables(connection: ADODB.open): Promise<any[]> {
  // TABLE, LINK, ACCESS TABLE, SYSTEM TABLE, VIEW
  const result: Array<any> = [];
  try {
    const schema: Array<any> = await connection.schema(20);
    schema.forEach((table) => {
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
