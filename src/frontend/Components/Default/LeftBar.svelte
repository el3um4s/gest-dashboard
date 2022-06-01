<script lang="ts">
  import SideBar from "./SideBar.svelte";

  import Settings from "../Pages/Settings.svelte";
  import Help from "../Pages/Help.svelte";
  import Info from "../Pages/Info.svelte";
  import WebPage from "../Pages/WebPage.svelte";
  import LocalFolder from "../Pages/LocalFolder.svelte";

  import { show, openNewWindow } from "../../Functions/show";

  import {
    faFolderOpen,
    faExternalLinkSquareAlt,
    faCog,
    faQuestionCircle,
    faInfoCircle,
    faGlobe,
  } from "@fortawesome/free-solid-svg-icons";

  let listButtons = [
    {
      id: "openFolder",
      icon: faFolderOpen,
      visible: true,
      title: "Open folder in this window",
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
      id: "openNewWindow",
      icon: faExternalLinkSquareAlt,
      visible: true,
      title: "Open new window",
      onClick: () => {
        openNewWindow();
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
  ];
</script>

<SideBar {listButtons} slot="leftbar" />
