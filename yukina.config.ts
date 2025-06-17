import I18nKeys from "./src/locales/keys";
import type { Configuration } from "./src/types/config";

const YukinaConfig: Configuration = {
  title: "2tap2.be",
  subTitle: "Linux, Open-Source & Nerd Stuff",
  brandTitle: "2TAP2B",

  description: "2bs blog",

  site: "https://2tap2.be",

  locale: "de", // set for website language and date format

  navigators: [
    {
      nameKey: I18nKeys.nav_bar_home,
      href: "/",
    },
    {
      nameKey: I18nKeys.nav_bar_archive,
      href: "/archive",
    },
    {
      nameKey: I18nKeys.nav_bar_about,
      href: "/about",
    },
    {
      nameKey: I18nKeys.nav_bar_projects,
      href: "/projects",
    },
    {
      nameKey: I18nKeys.nav_bar_github,
      href: "https://github.com/WhitePaper233/yukina",
    },
  ],

  username: "2tap2b",
  sign: "[ˌtuːˌtæpˈtoːbi]",
  avatarUrl: "https://git.steltner.cloud/avatars/0150c9f9a95f6772bde657392c4922f07cf2ceac7f7f77c72440c578875a265b?size=512",
  socialLinks: [
    {
      icon: "line-md:document-code",
      link: "https://codeberg.org/2TAP2B",
    },
    {
      icon: "line-md:mastodon-filled",
      link: "https://social.xanten.cc/@tobias",
    },
    {
      icon: "line-md:chat-round-dots-twotone",
      link: "https://matrix.to/#/@tobias:xanten.cc",
    },
    {
      icon: "line-md:rss",
      link: "https://2tap2.be/rss.xml",
    },
  ],
  maxSidebarCategoryChip: 6, // It is recommended to set it to a common multiple of 2 and 3
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,

  banners: [
    "https://images.unsplash.com/photo-1639066648921-82d4500abf1a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1489436969537-cf0c1dc69cba?q=80&w=1812&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1667264501379-c1537934c7ab?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1658310669553-11a639f85208?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],

  slugMode: "RAW", // 'RAW' | 'HASH'

  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },

  // WIP functions
  bannerStyle: "LOOP", // 'loop' | 'static' | 'hidden'
};

export default YukinaConfig;
