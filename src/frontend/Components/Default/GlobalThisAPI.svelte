<script lang="ts">
  import chokidar from "@el3um4s/renderer-for-electron-chokidar";
  import browserView from "@el3um4s/renderer-electron-window-browser-view";

  import { status } from "../../Stores/Status";
  import {
    show,
    reloadCurrentPageBrowserView,
    reloadFolder,
    resizeBrowserView,
  } from "../../Functions/show";
  import { FolderHandle } from "../../sw/folderHandler";

  import match from "@el3um4s/match";

  browserView.on.browserViewCanBeShowed({
    callback: async (data) => {
      const folderHandle = $status.sw.folderHandle;
      const hostName = $status.sw.hostName;

      let outerW = globalThis.outerWidth;
      let isMaximized = outerW >= globalThis.screen.availWidth;
      resizeBrowserView(isMaximized);

      if (folderHandle && data == false) {
        status.folderHandle(await FolderHandle.reInit(folderHandle, hostName));
        show($status.sw.folderHandle ? true : false);
      }
    },
  });

  chokidar.on.folderChanged({
    callback: (data) => {
      const { path, eventName, nameWatcher } = data;
      console.log(path, eventName, nameWatcher);
      const reloadWhenFolderChange = $status.reloadWhenFolderChange;

      match(reloadWhenFolderChange)
        .on("current page", () => reloadCurrentPageBrowserView())
        .on("local folder", () => reloadFolder());
    },
  });
</script>
