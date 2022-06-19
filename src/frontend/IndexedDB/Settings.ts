import { get, set, createStore } from "idb-keyval";
import type { HistoryBrowser } from "../Interfaces/StatusInterface";

const customDbName = "idb-settings";
const customStoreName = "idb-settings-store";

const customStore = createStore(customDbName, customStoreName);

const setTech = async (t: "iframe" | "browserview") => {
  await set("tech", t, customStore);
};

const getTech = async (d: "iframe" | "browserview" = "iframe") => {
  const tech = await get("tech", customStore);

  if (tech === undefined) {
    await setTech(d);
    return d;
  }
  return tech;
};

const setLang = async (l: "en" | "it") => {
  await set("lang", l, customStore);
};

const getLang = async (l: "en" | "it") => {
  const lang = await get("lang", customStore);

  if (lang === undefined) {
    await setLang(l);
    return l;
  }

  return lang;
};

const setShowIndexHtmlImmediately = async (show: boolean) => {
  await set("showIndexHtmlImmediately", show, customStore);
};

const getShowIndexHtmlImmediately = async (show: boolean = true) => {
  const showIndexHtmlImmediately = await get(
    "showIndexHtmlImmediately",
    customStore
  );

  if (showIndexHtmlImmediately === undefined) {
    await setShowIndexHtmlImmediately(show);
    return show;
  }

  return showIndexHtmlImmediately;
};

const setReloadWhenFolderChange = async (
  reload: "no" | "current page" | "local folder"
) => {
  await set("reloadWhenFolderChange", reload, customStore);
};

const getReloadWhenFolderChange = async (
  reload: "no" | "current page" | "local folder" = "no"
) => {
  const reloadWhenFolderChange = await get(
    "reloadWhenFolderChange",
    customStore
  );

  if (reloadWhenFolderChange === undefined) {
    await setReloadWhenFolderChange(reload);
    return reload;
  }

  return reloadWhenFolderChange;
};

const setURLBrowser = async (url: string) => {
  await set("urlBrowser", url, customStore);
};

const getURLBrowser = async (url: string = "http://www.example.com") => {
  const urlBrowser = await get("urlBrowser", customStore);

  if (urlBrowser === undefined) {
    await setURLBrowser(url);
    return url;
  }

  return urlBrowser;
};

const setHistoryBrowser = async (history: HistoryBrowser[]) => {
  await set("historyBrowser", history, customStore);
};

const getHistoryBrowser = async (history: HistoryBrowser[] = []) => {
  const historyBrowser = await get("historyBrowser", customStore);

  if (historyBrowser === undefined) {
    await setHistoryBrowser(history);
    return history;
  }

  return historyBrowser;
};

export const idbSettings = {
  setTech,
  getTech,

  setLang,
  getLang,

  setShowIndexHtmlImmediately,
  getShowIndexHtmlImmediately,

  setReloadWhenFolderChange,
  getReloadWhenFolderChange,

  setURLBrowser,
  getURLBrowser,

  setHistoryBrowser,
  getHistoryBrowser,
};
