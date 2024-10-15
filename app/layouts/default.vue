<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "analytics"],
})

const colorMode = useColorMode()
colorMode.preference = "light"

const route = useRoute()
const { t } = useI18n()
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})
const title = computed(() => t(String(route.meta.title ?? 'TBD'), t('layouts.title'))
);
</script>

<template>
  <div id="wrap">
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
      <Head>
        <Title>{{ title }}</Title>
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
      </Head>
      <Body>
        <header id="header">
          <TopNavi class="m-4"/>
        </header>
        <div id="container" class="m-4">
          <slot />
        </div>
        <footer id="footer" class="align-items-end text-center">
          <BottomNavi  class="m-4" />
        </footer>
      </Body>
    </Html>
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
