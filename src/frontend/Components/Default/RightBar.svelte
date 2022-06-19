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

  import languages from "../../Languages/languages";
  let lang = $status.lang;

  let listButtons = [
    {
      id: "showFolder",
      icon: faEye,
      visible: false,
      title: languages.rightBar.showFolder[lang],
      onClick: () => {
        show(true);
      },
    },
    {
      id: "reloadFolder",
      icon: faFolderTree,
      visible: false,
      title: languages.rightBar.reloadFolder[lang],
      onClick: async () => {
        await reloadFolder();
      },
    },
    {
      id: "printBrowserView",
      icon: faPrint,
      visible: false,
      title: languages.rightBar.printBrowserView[lang],
      onClick: () => {
        printBrowserView();
      },
    },

    {
      id: "showDevTools",
      icon: faCode,
      visible: true,
      title: languages.rightBar.showDevTools[lang],
      onClick: () => {
        showDevTools();
      },
    },

    {
      id: "goBack",
      icon: faArrowLeft,
      visible: false,
      title: languages.rightBar.goBack[lang],
      onClick: () => {
        goBackBrowserView();
      },
    },
    {
      id: "goForward",
      icon: faArrowRight,
      visible: false,
      title: languages.rightBar.goForward[lang],
      onClick: () => {
        goForwardBrowserView();
      },
    },
    {
      id: "reloadCurrentPage",
      icon: faRotateRight,
      visible: false,
      title: languages.rightBar.reloadCurrentPage[lang],
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

  $: listButtons = [
    ...listButtons.map((b) => {
      b.title = languages.rightBar[b.id][$status.lang];
      return b;
    }),
  ];
</script>

<SideBar {listButtons} slot="rightbar" />
