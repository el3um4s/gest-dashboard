// @ts-check
/// <reference lib="webworker" />
// https://joshuatz.com/posts/2021/strongly-typed-service-workers/

import { writable } from "svelte/store";
import { idbSettings } from "../IndexedDB/Settings";

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
  urlBrowser: string;
}

const defaultStatus: StatusInterface = {
  isElectron: false,
  hasIFRame: false,
  showIframe: false,
  hasBrowserView: false,
  componentVisible: undefined,
  sw: {
    folderHandle: null,
    hostName: "",
    swScope: null,
    clientId: "",
  },
  folderName: "",
  tech: "iframe",
  showIndexHtmlImmediately: true,
  urlBrowser: "http://www.example.com",
};

const statusStore = writable(defaultStatus);

export const status = {
  subscribe: statusStore.subscribe,
  isElectron: (v: boolean) =>
    statusStore.update((s) => {
      const isElectron = v;
      return { ...s, isElectron };
    }),
  hasIFrame: (v: boolean) =>
    statusStore.update((s) => {
      const hasIFRame = v;
      return { ...s, hasIFRame };
    }),
  showIframe: (v: boolean) =>
    statusStore.update((s) => {
      const showIframe = v;
      return { ...s, showIframe };
    }),
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
  folderHandle: (v: FileSystemDirectoryHandle) =>
    statusStore.update((s) => {
      const folderHandle = v;
      const sw = { ...s.sw, folderHandle };
      const folderName = folderHandle?.name;
      return { ...s, sw, folderName };
    }),
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
  tech: async (t: "iframe" | "browserview") => {
    statusStore.update((s) => {
      const tech = t;
      return { ...s, tech };
    });
    await idbSettings.setTech(t);
  },
  showIndexHtmlImmediately: async (show: boolean) => {
    statusStore.update((s) => {
      const showIndexHtmlImmediately = show;
      return { ...s, showIndexHtmlImmediately };
    });
    await idbSettings.setShowIndexHtmlImmediately(show);
  },
  urlBrowser: async (url: string) => {
    statusStore.update((s) => {
      const urlBrowser = url;
      return { ...s, urlBrowser };
    });
    await idbSettings.setURLBrowser(url);
  },
};
