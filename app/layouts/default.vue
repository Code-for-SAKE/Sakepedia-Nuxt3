<script setup lang="ts">
const { t } = useI18n()

const navLinks = [
  [],
  [
    {
      label: t("sake"),
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
]

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
      to: "/",
    },
    {
      label: "Sakepediaについて",
      to: "/about",
    },
  ],
  [],
]

const colorMode = useColorMode()
colorMode.preference = "light"
</script>

<template>
  <div id="wrap" class="m-4">
    <header id="header" class="">
      <div class="flex flex-wrap">
        <div class="flex-none w-40">
          <NuxtLink to="/">
            <img height="50" src="~/assets/image/sakepedia-yoko.png" alt="Sakepedia" >
          </NuxtLink>
        </div>
        <div class="flex items-center">- みんなで作る日本酒オープンデータ</div>
        <div class="flex-auto">
          <UHorizontalNavigation :links="navLinks">
            <template #default="{ link }">
              <span class="group-hover:text-primary relative">{{ link.label }}</span>
            </template>
          </UHorizontalNavigation>
        </div>
      </div>
    </header>
    <div id="container">
      <slot/>
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

<style lang="scss" scoped>
#footer {
  padding-top: 100px;
  background-image: url("~/assets/image/sake-footer_bg.png");
  background-repeat: repeat-x;
  background-position: top;
}

#footer-content {
  width: 100%;
  color: var(--white);
  background-color: var(--primary);
}

#footer-content > * {
  display: inline-block;
}
</style>
