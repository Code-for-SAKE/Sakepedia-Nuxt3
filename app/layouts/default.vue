<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
})

const colorMode = useColorMode()
colorMode.preference = "light"
</script>

<template>
  <div id="wrap" class="m-4">
    <header id="header" class="">
      <TopNavi />
    </header>
    <div id="container">
      <slot />
    </div>
    <footer id="footer" class="align-items-end text-center">
      <BottomNavi />
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
