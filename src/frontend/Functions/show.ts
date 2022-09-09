import { get } from "svelte/store";
import { status } from "../Stores/Status";
import { FolderHandle } from "../sw/folderHandler";

import browserView from "@el3um4s/renderer-electron-window-browser-view";

const bounds = {
  paddingLeft: 65,
  paddingTop: 33,
  paddingRight: 131,
  paddingBottom: 58,
  show: true,
};

const apiKey = "api";

export const show = (view: boolean, component: any = undefined) => {
  status.componentVisible(component);
  // globalThis.api.windowManager.send("showBrowserView", { show: view });
  // globalThis.api.browserView.send("showBrowserView", { ...bounds, show: view });
  browserView.showBrowserView({
    bounds: {
      ...bounds,
      show: view,
    },
    apiKey,
  });
};

export const showDevTools = () => {
  // globalThis.api.windowManager.send("openBrowserViewDevTools");
  // globalThis.api.browserView.send("openBrowserViewDevTools");
  browserView.openBrowserViewDevTools({ apiKey });
};

export const openNewWindow = () => {
  const message = {
    link: undefined,
  };
  globalThis.api.windowManager.send("openInNewWindow", message);
};

export const printBrowserView = () => {
  // globalThis.api.windowManager.send("printBrowserView");
  // globalThis.api.browserView.send("printBrowserView");
  browserView.printBrowserView({ apiKey });
};

export const reloadFolder = async () => {
  const s = get(status);

  show(false);

  const folderHandle = s.sw.folderHandle;
  const hostName = s.sw.hostName;

  status.folderHandle(null);
  status.swScope(null);
  status.hostName("");

  if (folderHandle) {
    status.folderHandle(await FolderHandle.reInit(folderHandle, hostName));
    show(s.sw.folderHandle ? true : false);
  }
};

export const goBackBrowserView = () => {
  // globalThis.api.windowManager.send("goBackBrowserView");
  // globalThis.api.browserView.send("goBackBrowserView");
  browserView.goBackBrowserView({ apiKey });
};

export const goForwardBrowserView = () => {
  // globalThis.api.windowManager.send("goForwardBrowserView");
  // globalThis.api.browserView.send("goForwardBrowserView");
  browserView.goForwardBrowserView({ apiKey });
};

export const reloadCurrentPageBrowserView = () => {
  // globalThis.api.windowManager.send("reloadCurrentPageBrowserView");
  // globalThis.api.browserView.send("reloadCurrentPageBrowserView");
  browserView.reloadCurrentPageBrowserView({ apiKey });
};
