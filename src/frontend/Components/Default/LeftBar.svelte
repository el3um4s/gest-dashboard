<script lang="ts">
  import { tick } from "svelte";

  import { status } from "../../Stores/Status";
  import SideBar from "./SideBar.svelte";
  import { FolderHandle } from "../../sw/folderHandler";
  import Settings from "../Pages/Settings.svelte";
  import Help from "../Pages/Help.svelte";
  import Info from "../Pages/Info.svelte";
  import WebPage from "../Pages/WebPage.svelte";
  import LocalFolder from "../Pages/LocalFolder.svelte";

  import {
    faFolderOpen,
    faEye,
    faRedoAlt,
    faExternalLinkSquareAlt,
    faCog,
    faQuestionCircle,
    faInfoCircle,
    faCode,
    faPrint,
    faGlobe,
  } from "@fortawesome/free-solid-svg-icons";

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

  const show = (view: boolean, component: any = undefined) => {
    status.componentVisible(component);
    status.showIframe(view);
    if ($status.isElectron && $status.tech === "browserview") {
      globalThis.api.windowManager.send("showBrowserView", { show: view });
    } else {
      globalThis.api.windowManager.send("removeBrowserView");
    }
  };

  const showDevTools = () => {
    globalThis.api.windowManager.send("openBrowserViewDevTools");
  };

  let listButtons = [
    {
      id: "openFolder",
      icon: faFolderOpen,
      visible: true,
      title: "Open folder in this window",
      // onClick: async () => {
      //   show(false);
      //   status.folderHandle(null);
      //   tick();
      //   status.folderHandle(await FolderHandle.init($status.sw.hostName));
      //   show($status.sw.folderHandle ? true : false);
      // },
      onClick: () => {
        show(false, LocalFolder);
      },
    },
    {
      id: "openWebPage",
      icon: faGlobe,
      visible: true,
      title: "Open Web Page (BrowserView)",
      onClick: () => {
        show(false, WebPage);
      },
    },
    {
      id: "printBrowserView",
      icon: faPrint,
      visible: false,
      title: "Print (BrowserView)",
      onClick: () => {
        globalThis.api.windowManager.send("printBrowserView");
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
        show(false);

        const folderHandle = $status.sw.folderHandle;
        const hostName = $status.sw.hostName;

        status.folderHandle(null);
        status.swScope(null);
        status.hostName("");

        await tick();

        if (folderHandle) {
          status.folderHandle(
            await FolderHandle.reInit(folderHandle, hostName)
          );
          show($status.sw.folderHandle ? true : false);
        }
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
        show(false, Settings);
      },
    },
    {
      id: "openHelp",
      icon: faQuestionCircle,
      visible: true,
      title: "Help",
      onClick: () => {
        show(false, Help);
      },
    },
    {
      id: "openInfo",
      icon: faInfoCircle,
      visible: true,
      title: "Info",
      onClick: () => {
        show(false, Info);
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

<SideBar {listButtons} slot="leftbar" />
