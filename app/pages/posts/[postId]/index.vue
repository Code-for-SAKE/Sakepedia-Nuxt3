<script setup lang="ts">
import { DocumentReference } from "firebase/firestore"
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem: getBrand } = useBrand()
const { getItem: getBrewery } = useBrewery()
const { getItem: getSake } = useSake()
const { getItem, deleteItem } = usePost()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const post = await getItem(dataPath)

let brewery: Data<Brewery> | undefined = undefined
if (typeof post.data.brewery == "string") {
  brewery = await getBrewery(post.data.brewery)
} else {
  brewery = await getBrewery(post.data.brewery.path)
}
let brand: Data<Brand> | undefined = undefined
if (typeof post.data.brand == "string") {
  brand = await getBrand(post.data.brand)
} else if (post.data.brand instanceof DocumentReference) {
  brand = await getBrand(post.data.brand.path)
}
let sake: Data<Sake> | undefined = undefined
if (typeof post.data.sake == "string") {
  sake = await getSake(post.data.sake)
} else if (post.data.sake instanceof DocumentReference) {
  sake = await getSake(post.data.sake.path)
}
const confirmDelete = ref(false)
const deletePost = async function () {
  await deleteItem(post.path)
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
      <dd>
        <MultiImage v-model="post.data.image" />
      </dd>
      <dt>{{ $t("pairing") }}</dt>
      <dd>
        <UBadge v-for="mariage in post?.data.mariages" :key="mariage">{{ mariage }}</UBadge>
      </dd>
      <dt>{{ $t("createdAt") }}</dt>
      <dd>{{ datetime(post.createdAt) }} by {{ post.createdUser?.displayName }}</dd>
      <dt>{{ $t("updatedAt") }}</dt>
      <dd>{{ datetime(post.updatedAt) }} by {{ post.updatedUser?.displayName }}</dd>
    </dl>
    <UFormGroup>
      <UButton class="info" :to="route.path + '/update'">{{ $t("update") }}</UButton>
      <UButton class="danger" @click="confirmDelete = true">{{ $t("delete") }}</UButton>
    </UFormGroup>
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
