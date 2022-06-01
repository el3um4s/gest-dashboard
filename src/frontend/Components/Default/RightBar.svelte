<script lang="ts">
  import { status } from "../../Stores/Status";
  import SideBar from "./SideBar.svelte";

  import {
    show,
    showDevTools,
    reloadFolder,
    printBrowserView,
    goBackBrowserView,
    goForwardBrowserView,
    reloadCurrentPageBrowserView,
  } from "../../Functions/show";

  import {
    faEye,
    faFolderTree,
    faCode,
    faPrint,
    faArrowLeft,
    faArrowRight,
    faRotateRight,
  } from "@fortawesome/free-solid-svg-icons";

  let listButtons = [
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
      icon: faFolderTree,
      visible: false,
      title: "Reload folder in this window",
      onClick: async () => {
        await reloadFolder();
      },
    },
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
      id: "showDevTools",
      icon: faCode,
      visible: true,
      title: "Show Dev Tools (BrowserView)",
      onClick: () => {
        showDevTools();
      },
    },

    {
      id: "goBack",
      icon: faArrowLeft,
      visible: false,
      title: "Makes the browser go back a page (BrowserView)",
      onClick: () => {
        goBackBrowserView();
      },
    },
    {
      id: "goForward",
      icon: faArrowRight,
      visible: false,
      title: "Makes the browser go forward a web page (BrowserView)",
      onClick: () => {
        goForwardBrowserView();
      },
    },
    {
      id: "reloadCurrentPage",
      icon: faRotateRight,
      visible: false,
      title: "Reloads the current page (BrowserView)",
      onClick: () => {
        reloadCurrentPageBrowserView();
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
