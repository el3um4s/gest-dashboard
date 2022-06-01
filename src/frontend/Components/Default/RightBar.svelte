<script lang="ts">
  import { status } from "../../Stores/Status";
  import SideBar from "./SideBar.svelte";

  import {
    show,
    showDevTools,
    reloadFolder,
    printBrowserView,
  } from "../../Functions/show";

  import {
    faEye,
    faRedoAlt,
    faCode,
    faPrint,
  } from "@fortawesome/free-solid-svg-icons";

  let listButtons = [
    {
      id: "printBrowserView",
      icon: faPrint,
      visible: false,
      title: "Print (BrowserView)",
      onClick: () => {
        printBrowserView();
      },
    },
    {
      id: "showFolder",
      icon: faEye,
      visible: false,
      title: "Show folder in this window",
      onClick: () => {
        show(true);
      },
    },
    {
      id: "reloadFolder",
      icon: faRedoAlt,
      visible: false,
      title: "Reload folder in this window",
      onClick: async () => {
        await reloadFolder();
      },
    },

    {
      id: "showDevTools",
      icon: faCode,
      visible: true,
      title: "Show Dev Tools (BrowserView)",
      onClick: () => {
        showDevTools();
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
      } else if ($status.browserStarted) {
        b.visible = true;
        if (b.id == "reloadFolder") {
          b.visible = false;
        }
      } else if (
        b.id == "showFolder" ||
        b.id == "reloadFolder" ||
        b.id == "printBrowserView"
      ) {
        b.visible = false;
      }
      return b;
    }),
  ];
</script>

<SideBar {listButtons} slot="rightbar" />
