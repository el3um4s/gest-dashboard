<script lang="ts">
  import { tick } from "svelte";

  import { status } from "../../Stores/Status";
  import SideBar from "./SideBar.svelte";
  import { FolderHandle } from "../../sw/folderHandler";
  import Settings from "../Pages/Settings.svelte";
  import Help from "../Pages/Help.svelte";
  import Info from "../Pages/Info.svelte";

  import {
    faFolderOpen,
    faEye,
    faRedoAlt,
    faExternalLinkSquareAlt,
    faCog,
    faQuestionCircle,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";

  let listButtons = [
    {
      id: "openFolder",
      icon: faFolderOpen,
      visible: true,
      title: "Open folder in this window",
      onClick: async () => {
        status.componentVisible(undefined);
        status.showIframe(false);
        status.folderHandle(null);
        status.folderHandle(await FolderHandle.init($status.sw.hostName));
        status.showIframe($status.sw.folderHandle ? true : false);
      },
    },
    {
      id: "showFolder",
      icon: faEye,
      visible: false,
      title: "Show folder in this window",
      onClick: () => {
        status.showIframe(true);
        status.componentVisible(undefined);
      },
    },
    {
      id: "reloadFolder",
      icon: faRedoAlt,
      visible: false,
      title: "Reload folder in this window",
      onClick: async () => {
        status.componentVisible(undefined);

        const tempSWScope = $status.sw.swScope;
        const tempSWhostName = $status.sw.hostName;
        status.swScope(null);
        status.hostName("");

        await tick();

        status.swScope(tempSWScope);
        status.hostName(tempSWhostName);
        status.showIframe(true);
      },
    },
    {
      id: "openNewWindow",
      icon: faExternalLinkSquareAlt,
      visible: true,
      title: "Open new window",
      onClick: () => {
        if ($status.isElectron) {
          const message = {
            link: undefined,
          };
          globalThis.api.windowManager.send("openInNewWindow", message);
        } else {
          window.open(window.location.href);
        }
      },
    },
    {
      id: "openSettings",
      icon: faCog,
      visible: true,
      title: "Settings",
      onClick: () => {
        status.showIframe(false);
        status.componentVisible(Settings);
      },
    },
    {
      id: "openHelp",
      icon: faQuestionCircle,
      visible: true,
      title: "Help",
      onClick: () => {
        status.showIframe(false);
        status.componentVisible(Help);
      },
    },
    {
      id: "openInfo",
      icon: faInfoCircle,
      visible: true,
      title: "Info",
      onClick: () => {
        status.showIframe(false);
        status.componentVisible(Info);
      },
    },
  ];

  $: listButtons = [
    ...listButtons.map((b) => {
      if (
        $status.sw.folderHandle &&
        $status.sw.hostName != "" &&
        $status.sw.clientId != ""
      ) {
        b.visible = true;
      } else if (b.id == "showFolder" || b.id == "reloadFolder") {
        b.visible = false;
      }
      return b;
    }),
  ];
</script>

<SideBar {listButtons} slot="leftbar" />
