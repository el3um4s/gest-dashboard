import { SW } from "./serviceWorker";

const pickFolder = async (): Promise<FileSystemDirectoryHandle> => {
  const folderHandle: FileSystemDirectoryHandle = await window[
    "showDirectoryPicker"
  ]();
  return folderHandle;
};

const init = async (
  hostName: string = ""
): Promise<FileSystemDirectoryHandle> => {
  const folderHandle: FileSystemDirectoryHandle = await pickFolder();
  await SW.waitForReady();
  SW.post({
    type: "host-start",
    hostName,
  });
  return folderHandle;
};

const reInit = async (
  folderHandle: FileSystemDirectoryHandle,
  hostName: string = ""
): Promise<FileSystemDirectoryHandle> => {
  await SW.waitForReady();
  SW.post({
    type: "host-start",
    hostName,
  });
  return folderHandle;
};

export const FolderHandle = {
  init,
  reInit,
};
