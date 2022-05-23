import { get, set, createStore } from "idb-keyval";

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

export const idbSettings = {
  setTech,
  getTech,
  setShowIndexHtmlImmediately,
  getShowIndexHtmlImmediately,
  setURLBrowser,
  getURLBrowser,
};
