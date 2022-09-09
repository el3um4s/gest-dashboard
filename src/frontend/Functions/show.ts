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

export const show = (view: boolean, component: any = undefined) => {
  status.componentVisible(component);
  browserView.showBrowserView({
    bounds: {
      ...bounds,
      show: view,
    },
  });
};

export const showDevTools = () => {
  browserView.openBrowserViewDevTools();
};

export const openNewWindow = () => {
  const message = {
    link: undefined,
  };
  globalThis.api.windowManager.send("openInNewWindow", message);
};

export const printBrowserView = () => {
  browserView.printBrowserView();
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
  browserView.goBackBrowserView();
};

export const goForwardBrowserView = () => {
  browserView.goForwardBrowserView();
};

export const reloadCurrentPageBrowserView = () => {
  browserView.reloadCurrentPageBrowserView();
};
