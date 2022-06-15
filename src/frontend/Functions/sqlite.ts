export const testSQLite = (historyBrowser) => {
  globalThis.api.sqlite.send("testSQLite", historyBrowser);
};

export const loadHistoryBrowser = () => {
  globalThis.api.sqlite.send("loadHistoryBrowser");
};

// https://willschenk.com/articles/2021/sq_lite_in_the_browser/
// https://sql.js.org/#/
// https://github.com/WiseLibs/better-sqlite3
