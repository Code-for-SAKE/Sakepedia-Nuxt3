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
    <h1>{{ $t("brandDetails") }}</h1>
    <hr />

    <dd>{{ brand.id }}</dd>
    <h2>{{ brand?.data.name }}</h2>

    <dl>
      <dt>{{ $t("brewery") }}</dt>
      <dd>
        <NuxtLink v-if="brand?.data.brewery" :to="'/' + brewery?.path">
          <div class="w-full">{{ brewery?.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("logo") }}</dt>
      <dd>{{ brand?.data.logo }}</dd>
      <dt>{{ $t("speciality") }}</dt>
      <dd>{{ brand?.data.description }}</dd>
      <dt>{{ $t("updatedAt") }}</dt>
      <dd>{{ brand?.data.updatedAt }}</dd>
    </dl>
    <UButton class="info" :to="route.path + '/update'">{{ $t("edit") }}</UButton>
    <UButton class="danger" @click="confirmDelete = true">{{ $t("delete") }}</UButton>
    <UModal v-model="confirmDelete">
      <UCard>
        <Alert>{{ $t("confirmDelete") }}</Alert>
        <template #footer>
          <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
          <UButton class="danger" @click="deleteBrand">{{ $t("yes") }}</UButton>
        </template>
      </UCard>
    </UModal>
    <hr />
    <div class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("sakeList") }}</h3>
        <div class="d-flex justify-content-between">
          <div></div>

          <UButton class="success" :to="localePath(`${route.path}/sakes/add`)">{{
            $t("addSake")
          }}</UButton>
        </div>
      </div>
      <!-- <comment-list /> -->
    </div>
    <div class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("postList") }}</h3>
        <div class="d-flex justify-content-between">
          <div></div>

          <UButton class="success" @click="confirmDelete = false">{{ $t("addPost") }}</UButton>
        </div>
      </div>
      <!-- <comment-list /> -->
    </div>
  </div>
</template>
