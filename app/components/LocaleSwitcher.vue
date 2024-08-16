<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.map((v) => {
    return v.code == locale.value
      ? [
          {
            code: v.code,
            label: v.name,
            disabled: true,
          },
        ]
      : [
          {
            code: v.code,
            label: v.name,
            click: () => {
              navigateTo(switchLocalePath(v.code), { replace: true })
            },
          },
        ]
  })
})
</script>

<template>
  <UDropdown :items="availableLocales">
    <UButton color="white" :label="$t('lang')" trailing-icon="i-heroicons-chevron-down-20-solid" />
  </UDropdown>
</template>
