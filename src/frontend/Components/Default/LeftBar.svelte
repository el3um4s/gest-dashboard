<script lang="ts">
  import { status } from "../../Stores/Status";

  import SideBar from "./SideBar.svelte";

  import Settings from "../Pages/Settings.svelte";
  import Help from "../Pages/Help.svelte";
  import Info from "../Pages/Info.svelte";
  import LocalFolder from "../Pages/LocalFolder.svelte";
  import Bookmark from "../Pages/Bookmark.svelte";

  import { show, openNewWindow } from "../../Functions/show";

  import {
    faFolderOpen,
    faExternalLinkSquareAlt,
    faCog,
    faQuestionCircle,
    faInfoCircle,
    faBookmark,
  } from "@fortawesome/free-solid-svg-icons";

  import languages from "../../Languages/Languages";
  let lang = $status.lang;

  let listButtons = [
    {
      id: "openFolder",
      icon: faFolderOpen,
      visible: true,
      title: languages.leftBar.openFolder[lang],
      onClick: () => {
        show(false, LocalFolder);
      },
    },
    {
      id: "openBookmark",
      icon: faBookmark,
      visible: true,
      title: languages.leftBar.openBookmark[lang],
      onClick: () => {
        show(false, Bookmark);
      },
    },
    {
      id: "openNewWindow",
      icon: faExternalLinkSquareAlt,
      visible: true,
      title: languages.leftBar.openNewWindow[lang],
      onClick: () => {
        openNewWindow();
      },
    },
    {
      id: "openSettings",
      icon: faCog,
      visible: true,
      title: languages.leftBar.openSettings[lang],
      onClick: () => {
        show(false, Settings);
      },
    },
    {
      id: "openHelp",
      icon: faQuestionCircle,
      visible: true,
      title: languages.leftBar.openHelp[lang],
      onClick: () => {
        show(false, Help);
      },
    },
    {
      id: "openInfo",
      icon: faInfoCircle,
      visible: true,
      title: languages.leftBar.openInfo[lang],
      onClick: () => {
        show(false, Info);
      },
    },
  ];

  $: listButtons = [
    ...listButtons.map((b) => {
      b.title = languages.leftBar[b.id][$status.lang];
      return b;
    }),
  ];
</script>

<SideBar {listButtons} slot="leftbar" />
