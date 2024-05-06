<script setup lang="ts">
const route = useRoute();

const navLinks = [
  [
    {
      label: "- みんなで作る日本酒オープンデータ",
      avatar: {
        src: '~/assets/image/sakepedia-yoko.png',
        size: 'lg',
      },
      to: "/",
    },
  ],
  [
    {
      label: "日本酒",
      to: "/sakes",
    },
    {
      label: "銘柄",
      to: "/brands",
    },
    {
      label: "酒蔵",
      to: "/breweries",
    },
    {
      label: "投稿",
      to: "/comments",
    },
    {
      label: "Profile",
      to: "/login",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
    },
  ],
];

const footerLinks = [
  [],
  [
    {
      label: "Code for SAKE",
      to: "https://www.code4sake.org/",
    },
    {
      label: "Github",
      to: "https://github.com/Code-for-SAKE/Sakepedia-Nuxt",
    },
    {
      label: "API仕様",
      to: "/api/api-docs/",
    },
    {
      label: "Sakepediaについて",
      to: "/about",
    },
  ],
  [],
];

const colorMode = useColorMode()
colorMode.preference = 'light'

</script>

<template>
  <div id="wrap">
    <header id="header" class="">

      <UHorizontalNavigation :links="navLinks">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{ link.label }}</span>
        </template>
      </UHorizontalNavigation>
    </header>
    <div id="container">
      <slot></slot>
    </div>
    <footer id="footer" class="align-items-end text-center">
      <UHorizontalNavigation :links="footerLinks">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{ link.label }}</span>
        </template>
      </UHorizontalNavigation>
    </footer>
  </div>
</template>

<style scoped>
#footer {
  padding-top: 100px;
  background-image: url('~/assets/image/sake-footer_bg.png');
  background-repeat: repeat-x;
  background-position: top;
}

#footer-content {
  width: 100%;
  color: var(--white);
  background-color: var(--primary);
}

#footer-content>* {
  display: inline-block;
}
</style>
