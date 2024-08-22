<script setup lang="ts">
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem: getBrand } = useBrand()
const { getItem: getBrewery } = useBrewery()
const { getItem: getSake } = useSake()
const { getItem } = usePost()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const post = await getItem(dataPath)

let brewery: Data<Brewery> | undefined = undefined
if (post?.data.brewery) {
  brewery = await getBrewery(post.data.brewery.path)
}
let brand: Data<Brand> | undefined = undefined
if (post?.data.brand) {
    brand = await getBrand(post.data.brand.path)
}
let sake: Data<Sake> | undefined = undefined
if (post?.data.sake) {
    sake = await getSake(post.data.sake.path)
}
const confirmDelete = ref(false)
const deletePost = async function () {
  await deleteItem(brand.path)
  await navigateTo(localePath("/posts"))
}
</script>

<template>
  <div>
    <h1>{{ $t("postDetails") }}</h1>
    <dl>
      <dt>ID</dt>
      <dd>{{ post.id }}</dd>
      <dt>{{ $t("brewery") }}</dt>
      <dd>
        <NuxtLink v-if="post?.data.brewery" :to="localePath('/' + brewery?.path)">
          <div class="w-full">{{ brewery?.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("brand") }}</dt>
      <dd>
        <NuxtLink v-if="post?.data.brand" :to="localePath('/' + brand?.path)">
          <div class="w-full">{{ brand?.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("sake") }}</dt>
      <dd>
        <NuxtLink v-if="post?.data.sake" :to="'/' + sake?.path">
          <div class="w-full">{{ sake?.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("comment") }}</dt>
      <dd>{{ post?.data.comment }}</dd>
    </dl>
    <UButton class="info" :to="route.path + '/update'">{{ $t("search") }}</UButton>
    <UButton class="danger" @click="confirmDelete = true">{{ $t("delete") }}</UButton>
    <UModal v-model="confirmDelete">
      <UCard>
        <Alert>{{ $t("confirmDelete") }}</Alert>
        <template #footer>
          <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
          <UButton class="danger" @click="deletePost">{{ $t("yes") }}</UButton>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
