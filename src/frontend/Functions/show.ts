import { get } from "svelte/store";
import { status } from "../Stores/Status";
import { FolderHandle } from "../sw/folderHandler";

export const show = (view: boolean, component: any = undefined) => {
  status.componentVisible(component);
  globalThis.api.windowManager.send("showBrowserView", { show: view });
};

export const showDevTools = () => {
  globalThis.api.windowManager.send("openBrowserViewDevTools");
};

export const openNewWindow = () => {
  const message = {
    link: undefined,
  };
  globalThis.api.windowManager.send("openInNewWindow", message);
};

export const printBrowserView = () => {
  globalThis.api.windowManager.send("printBrowserView");
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
  globalThis.api.windowManager.send("goBackBrowserView");
};

export const goForwardBrowserView = () => {
  globalThis.api.windowManager.send("goForwardBrowserView");
};

export const reloadCurrentPageBrowserView = () => {
  globalThis.api.windowManager.send("reloadCurrentPageBrowserView");
};
