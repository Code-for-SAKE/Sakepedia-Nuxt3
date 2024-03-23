<script setup lang="ts">
const route = useRoute();

const navLinks = [
  [],
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
  ],
  [
    {
      label: "Profile",
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
</script>

<template>
  <div>
    <UHorizontalNavigation :links="navLinks">
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UHorizontalNavigation>
    <slot />
    <UHorizontalNavigation :links="footerLinks">
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UHorizontalNavigation>
  </div>
</template>

