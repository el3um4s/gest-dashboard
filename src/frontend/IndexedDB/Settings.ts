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

export const idbSettings = { setTech, getTech };
