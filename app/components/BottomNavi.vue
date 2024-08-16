<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

const footerLinks = computed(() => {
  return [
    [],
    [
      {
        label: "Code for SAKE",
        to: "https://www.code4sake.org",
      },
      {
        label: "Github",
        to: "https://github.com/Code-for-SAKE/Sakepedia-Nuxt",
      },
      {
        label: t("APIUsage"),
        to: "/",
      },
      {
        label: t("about"),
        to: localePath("/about"),
      },
    ],
    [],
  ]
})
</script>

<template>
  <UHorizontalNavigation :links="footerLinks">
    <template #default="{ link }">
      <span class="group-hover:text-primary relative">{{ link.label }}</span>
    </template>
  </UHorizontalNavigation>
</template>
