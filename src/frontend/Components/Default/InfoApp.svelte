<script lang="ts">
  import Lang from "./Lang.svelte";
  import systemInfo from "../../Functions/Events/systemInfo";
  import updaterInfo from "../../Functions/Events/updaterInfo";

  let app: string = "-";

  let chrome: string = "-";
  let node: string = "-";
  let electron: string = "-";

  // globalThis.api.systemInfo.send("requestSystemInfo", null);
  // const getInfo = async () => {
  //   const d = await systemInfo.requestSystemInfo();
  //   // const d = await systemInfo.on.getSystemInfo();
  //   console.log(d);
  //   return d;
  // };

  systemInfo.requestSystemInfo((data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
  });

  // systemInfo.requestSystemInfo();
  updaterInfo.requestVersionNumber((data) => {
    app = data.version;
  });

  // systemInfo.on.getSystemInfo().then((data) => {
  //   chrome = data.chrome;
  //   node = data.node;
  //   electron = data.electron;
  // });

  // systemInfo.on.getSystemInfo((data) => {
  //   chrome = data.chrome;
  //   node = data.node;
  //   electron = data.electron;
  // });

  // const a = await systemInfo.on.getSystemInfo();

  // getInfo().then((d) => {
  //   console.log(d);
  // });

  // globalThis.api.systemInfo.receive("getSystemInfo", (data) => {
  //   chrome = data.chrome;
  //   node = data.node;
  //   electron = data.electron;
  // });

  // globalThis.api.updaterInfo.send("requestVersionNumber", null);

  // systemInfo.requestVersionNumber();
  // globalThis.api.updaterInfo.receive("getVersionNumber", (data) => {
  //   app = data.version;
  // });
</script>

<div>
  <ul>
    <li><Lang c="infoApp" v="version" />: <b>{app}</b></li>
    <li><Lang c="infoApp" v="nodeJs" />: <b>{node}</b></li>
    <li><Lang c="infoApp" v="chromium" />: <b>{chrome}</b></li>
    <li><Lang c="infoApp" v="electron" />: <b>{electron}</b></li>
  </ul>
</div>
