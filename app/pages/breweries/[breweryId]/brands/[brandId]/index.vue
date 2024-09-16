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
    <dl>
      <dt>ID</dt>
      <dd>{{ brand.id }}</dd>
      <dt>{{ $t("name") }}</dt>
      <dd>{{ brand?.data.name }}</dd>
      <dt>{{ $t("brewery") }}</dt>
      <dd>
        <NuxtLink v-if="brand?.data.brewery" :to="'/' + brewery?.path">
          <div class="w-full">{{ brewery?.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("explanation") }}</dt>
      <dd>{{ brand?.data.description }}</dd>
    </dl>
    <UButton class="info" :to="route.path + '/update'">{{ $t("search") }}</UButton>
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
    <div class="my-4">
      {{ $t("sakeList") }}
      <UButton :to="localePath(`/${brand.path}/sakes/add`)">
        {{ $t("add") }}
      </UButton>
      <BrandSakeList :brand-path="brand.path" />
    </div>
    <div class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("postList") }}</h3>
      </div>
      <UButton
        :to="
          localePath({
            path: '/posts/add',
            query: {
              breweryId: route.params.breweryId,
              brandId: route.params.brandId,
            },
          })
        "
      >
        {{ $t("add") }}
      </UButton>
      <CommentList
        :brewery-id="String(route.params.breweryId)"
        :brand-id="String(route.params.brandId)"
      />
    </div>
  </div>
</template>
