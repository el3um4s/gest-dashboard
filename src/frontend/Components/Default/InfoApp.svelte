<script lang="ts">
  import Lang from "./Lang.svelte";

  let app: string = "-";

  let chrome: string = "-";
  let node: string = "-";
  let electron: string = "-";

  globalThis.api.systemInfo.send("requestSystemInfo", null);
  globalThis.api.systemInfo.receive("getSystemInfo", (data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
  });

  globalThis.api.updaterInfo.send("requestVersionNumber", null);

  globalThis.api.updaterInfo.receive("getVersionNumber", (data) => {
    app = data.version;
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
