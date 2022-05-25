export interface StatusInterface {
  isElectron: boolean;
  hasIFRame: boolean;
  showIframe: boolean;
  hasBrowserView: boolean;
  componentVisible: any;
  sw: {
    folderHandle: FileSystemDirectoryHandle;
    hostName: string;
    swScope: ServiceWorkerGlobalScope;
    clientId: string;
  };
  folderName: string;
  tech: "iframe" | "browserview";
  showIndexHtmlImmediately: boolean;
  browserStarted: boolean;
  urlBrowser: string;
  historyBrowser: HistoryBrowser[];
}

export interface HistoryBrowser {
  url: string;
  title: string;
  note: string;
  starred: boolean;
}
