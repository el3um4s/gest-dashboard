export interface StatusInterface {
  hasBrowserView: boolean;
  componentVisible: any;
  sw: {
    folderHandle: FileSystemDirectoryHandle;
    hostName: string;
    swScope: ServiceWorkerGlobalScope;
    clientId: string;
  };
  folderName: string;
  lang: "en" | "it";
  showIndexHtmlImmediately: boolean;
  reloadWhenFolderChange: "no" | "current page" | "local folder";
  browserStarted: boolean;
  urlBrowser: string;
  historyBrowser: HistoryBrowser[];
}

export interface HistoryBrowser {
  url: string;
  title: string;
  note: string;
  starred: boolean;
  folderHandle?: FileSystemDirectoryHandle;
}
