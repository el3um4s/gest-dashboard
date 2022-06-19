// @ts-check
/// <reference lib="webworker" />
// https://joshuatz.com/posts/2021/strongly-typed-service-workers/

import { writable } from "svelte/store";
import { idbSettings } from "../IndexedDB/Settings";

import type {
  StatusInterface,
  HistoryBrowser,
} from "../Interfaces/StatusInterface";

const defaultStatus: StatusInterface = {
  hasBrowserView: false,
  componentVisible: undefined,
  sw: {
    folderHandle: null,
    hostName: "",
    swScope: null,
    clientId: "",
  },
  folderName: "",
  lang: "en",
  showIndexHtmlImmediately: true,
  reloadWhenFolderChange: "no",
  browserStarted: false,
  urlBrowser: "http://www.example.com",
  historyBrowser: [],
};

const statusStore = writable(defaultStatus);

export const status = {
  subscribe: statusStore.subscribe,
  hasBrowserView: (v: boolean) =>
    statusStore.update((s) => {
      const hasBrowserView = v;
      return { ...s, hasBrowserView };
    }),
  componentVisible: (v: any) =>
    statusStore.update((s) => {
      const componentVisible = v;
      return { ...s, componentVisible };
    }),
  folderHandle: (v: FileSystemDirectoryHandle): FileSystemDirectoryHandle => {
    statusStore.update((s) => {
      const folderHandle = v;
      const sw = { ...s.sw, folderHandle };
      const folderName = folderHandle?.name;
      return { ...s, sw, folderName };
    });
    return v;
  },
  hostName: (v: string) =>
    statusStore.update((s) => {
      const hostName = v;
      const sw = { ...s.sw, hostName };
      return { ...s, sw };
    }),
  swScope: (v: ServiceWorkerGlobalScope) =>
    statusStore.update((s) => {
      const swScope = v;
      const sw = { ...s.sw, swScope };
      return { ...s, sw };
    }),
  clientId: (v: string) =>
    statusStore.update((s) => {
      const clientId = v;
      const sw = { ...s.sw, clientId };
      return { ...s, sw };
    }),
  lang: async (l: "en" | "it") => {
    statusStore.update((s) => {
      const lang = l;
      return { ...s, lang };
    });
    await idbSettings.setLang(l);
  },
  showIndexHtmlImmediately: async (show: boolean) => {
    statusStore.update((s) => {
      const showIndexHtmlImmediately = show;
      return { ...s, showIndexHtmlImmediately };
    });
    await idbSettings.setShowIndexHtmlImmediately(show);
  },

  reloadWhenFolderChange: async (
    reload: "no" | "current page" | "local folder"
  ) => {
    statusStore.update((s) => {
      const reloadWhenFolderChange = reload;
      return { ...s, reloadWhenFolderChange };
    });
    await idbSettings.setReloadWhenFolderChange(reload);
  },

  browserStarted: async (started: boolean) => {
    statusStore.update((s) => {
      const browserStarted = started;
      return { ...s, browserStarted };
    });
  },

  urlBrowser: async (url: string) => {
    statusStore.update((s) => {
      const urlBrowser = url;
      return { ...s, urlBrowser };
    });
    await idbSettings.setURLBrowser(url);
  },

  historyBrowser: async (history: HistoryBrowser[]) => {
    statusStore.update((s) => {
      const historyBrowser = history;
      return { ...s, historyBrowser };
    });
    await idbSettings.setHistoryBrowser(history);
  },

  historyBrowserAddNew: (item: HistoryBrowser) => {
    statusStore.update((s) => {
      const itemAlreadyListed = s.historyBrowser.filter(
        (el) => el.url == item.url
      );
      const newItem = itemAlreadyListed.length > 0 ? itemAlreadyListed : [item];
      if (item?.folderHandle) {
        const folderHandle = item.folderHandle;
        newItem[0] = { ...newItem[0], folderHandle };
      }

      const historyBrowser = [
        ...newItem,
        ...s.historyBrowser.filter((el) => el.url != item.url),
      ];

      idbSettings.setHistoryBrowser(historyBrowser);

      return { ...s, historyBrowser };
    });
  },

  historyBrowserReplaceList: (list: HistoryBrowser[]) => {
    const checkedList = list.map((el) => {
      if (el.folderHandle && typeof el.folderHandle === "string") {
        el.folderHandle = JSON.parse(el.folderHandle);
      }

      return el;
    });

    statusStore.update((s) => {
      idbSettings.setHistoryBrowser(checkedList);
      return { ...s, historyBrowser: checkedList };
    });
  },

  historyBrowserSetStarred: (item: HistoryBrowser, starred: boolean) => {
    statusStore.update((s) => {
      const historyBrowser = s.historyBrowser.map((i) => {
        if (i.url === item.url) {
          i.starred = starred;
        }
        return i;
      });

      idbSettings.setHistoryBrowser(historyBrowser);

      return { ...s, historyBrowser };
    });
  },

  historyBrowserSetTitle: (item: HistoryBrowser, title: string) => {
    statusStore.update((s) => {
      const historyBrowser = s.historyBrowser.map((i) => {
        if (i.url === item.url) {
          i.title = title;
        }
        return i;
      });

      idbSettings.setHistoryBrowser(historyBrowser);

      return { ...s, historyBrowser };
    });
  },

  historyBrowserSetNote: (item: HistoryBrowser, note: string) => {
    statusStore.update((s) => {
      const historyBrowser = s.historyBrowser.map((i) => {
        if (i.url === item.url) {
          i.note = note;
        }
        return i;
      });

      idbSettings.setHistoryBrowser(historyBrowser);

      return { ...s, historyBrowser };
    });
  },

  historyBrowserDeleteItem: (item: HistoryBrowser) => {
    statusStore.update((s) => {
      const historyBrowser = [
        ...s.historyBrowser.filter((el) => el.url != item.url),
      ];

      idbSettings.setHistoryBrowser(historyBrowser);

      return { ...s, historyBrowser };
    });
  },
};
