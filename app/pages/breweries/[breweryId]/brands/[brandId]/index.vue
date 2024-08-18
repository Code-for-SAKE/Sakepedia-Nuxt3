<script setup lang="ts">
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem, deleteItem } = useBrand()
const { getItem: getBrewery } = useBrewery()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const brand = await getItem(dataPath)

let brewery: Data<Brewery> | undefined = undefined
if (brand?.data.brewery) {
  brewery = await getBrewery(brand.data.brewery.path)
}

const confirmDelete = ref(false)
const deleteBrand = async function () {
  await deleteItem(brand.path)
  await navigateTo(localePath("/" + brand.data.brewery?.path))
}
</script>

<template>
  <div>
    <h1>銘柄 詳細</h1>
    <dl>
      <dt>ID</dt>
      <dd>{{ brand.id }}</dd>
      <dt>{{  $t("name") }}</dt>
      <dd>{{ brand?.data.name }}</dd>
      <dt>酒蔵</dt>
      <dd>
        <NuxtLink v-if="brand?.data.brewery" :to="'/' + brewery?.path">
          <div class="w-full">{{ brewery?.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>説明</dt>
      <dd>{{ brand?.data.description }}</dd>
    </dl>
    <UButton class="info" :to="route.path + '/update'">{{ $t("search") }}</UButton>
    <UButton class="danger" @click="confirmDelete = true">削除</UButton>
    <UModal v-model="confirmDelete">
      <UCard>
        <Alert>本当に削除しますか？</Alert>
        <template #footer>
          <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
          <UButton class="danger" @click="deleteBrand">はい</UButton>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
