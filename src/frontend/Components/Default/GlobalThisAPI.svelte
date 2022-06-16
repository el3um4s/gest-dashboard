<script lang="ts">
  import { status } from "../../Stores/Status";
  import {
    show,
    reloadCurrentPageBrowserView,
    reloadFolder,
  } from "../../Functions/show";
  import { FolderHandle } from "../../sw/folderHandler";

  import match from "@el3um4s/match";

  globalThis.api.windowManager.receive("showBrowserView", async (data) => {
    const folderHandle = $status.sw.folderHandle;
    const hostName = $status.sw.hostName;

    let outerW = globalThis.outerWidth;
    let isMaximized = outerW >= globalThis.screen.availWidth;
    globalThis.api.windowManager.send(
      isMaximized
        ? "resizeBrowserViewToMaximized"
        : "resizeBrowserViewToUnMaximized",
      null
    );

    if (folderHandle && data.present == "no") {
      status.folderHandle(await FolderHandle.reInit(folderHandle, hostName));
      show($status.sw.folderHandle ? true : false);
    }
  });

  globalThis.api.chokidarAPI.receive("folderChanged", async (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(path, eventName, nameWatcher);
    const reloadWhenFolderChange = $status.reloadWhenFolderChange;

    match(reloadWhenFolderChange)
      .on("current page", () => reloadCurrentPageBrowserView())
      .on("local folder", () => reloadFolder());
  });
</script>
