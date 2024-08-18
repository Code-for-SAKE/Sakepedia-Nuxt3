<script setup>
const { currentUser } = useAuth()
const { t } = useI18n()
const localePath = useLocalePath()

const navLinks = computed(() => {
  return [
    [],
    [
      {
        label: t("sake"),
        to: localePath("/sakes"),
      },
      {
        label: t("brand"),
        to: localePath("/brands"),
      },
      {
        label: t("brewery"),
        to: localePath("/breweries"),
      },
      {
        label: t("post"),
        to: localePath("/comments"),
      },
      {
        isLogin: true,
        label: t("login"),
        to: localePath("/login"),
      },
    ],
  ]
})
</script>
<template>
  <div class="flex flex-wrap">
    <div class="flex-none w-40">
      <NuxtLink :to="localePath('/')">
        <img height="50" src="~/assets/image/sakepedia-yoko.png" :alt="t('Sakepedia')" >
      </NuxtLink>
    </div>
    <div class="flex items-center">- {{ t("subtitle") }}</div>
    <div class="flex-auto m-3"><LocaleSwitcher /></div>
    <div class="flex-auto">
      <UHorizontalNavigation :links="navLinks">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{
            link.isLogin && currentUser ? currentUser.displayName : link.label
          }}</span>
        </template>
        <template #avatar="{ link }">
          <UAvatar
            v-if="link.isLogin && currentUser != null"
            size="xs"
            :alt="currentUser?.displayName ?? undefined"
            :src="currentUser?.photoURL ?? undefined"
          />
        </template>
      </UHorizontalNavigation>
    </div>
  </div>
</template>
