<script lang="ts">
  import { status } from "../../Stores/Status";
  import { show } from "../../Functions/show";
  import { FolderHandle } from "../../sw/folderHandler";

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
</script>
