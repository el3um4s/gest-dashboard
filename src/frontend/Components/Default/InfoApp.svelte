<script lang="ts">
  import Lang from "./Lang.svelte";
  import systemInfo from "@el3um4s/renderer-for-electron-system-info";

  let app: string = "-";
  let chrome: string = "-";
  let node: string = "-";
  let electron: string = "-";

  systemInfo.requestSystemInfo({
    callback: (data) => {
      chrome = data.chrome;
      node = data.node;
      electron = data.electron;
      app = data.app;
    },
  });
</script>

<div>
  <ul>
    <li><Lang c="infoApp" v="version" />: <b>{app}</b></li>
    <li><Lang c="infoApp" v="nodeJs" />: <b>{node}</b></li>
    <li><Lang c="infoApp" v="chromium" />: <b>{chrome}</b></li>
    <li><Lang c="infoApp" v="electron" />: <b>{electron}</b></li>
  </ul>
</div>
