<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
})

const colorMode = useColorMode()
colorMode.preference = "light"
</script>

<template>
  <div id="wrap">
    <header id="header">
      <TopNavi class="m-4"/>
    </header>
    <div id="container" class="m-4">
      <slot />
    </div>
    <footer id="footer" class="align-items-end text-center">
      <BottomNavi  class="m-4" />
    </footer>
  </div>
</template>

<style lang="scss">
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

.success {
  background-color: #8cbd21;
}

.danger {
  background-color: #823e73;
}

.info {
  background-color: #0c8bba;
}

h1 {
  font-size: 35px;
}

h2 {
  font-size: 28px;
}

h3 {
  font-size: 24.5px;
}

dt {
  font-weight: bold;
}
</style>
