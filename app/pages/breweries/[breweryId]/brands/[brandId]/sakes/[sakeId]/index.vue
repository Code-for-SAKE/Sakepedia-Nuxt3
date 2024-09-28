<script setup lang="ts">
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem: getSake, deleteItem } = useSake()
const { getItem: getBrewery } = useBrewery()
const { getItem: getBrand } = useBrand()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const item = await getSake(dataPath)
const sake: Data<Sake> = item

const breweryPath = sake.data.brewery?.path
const brewery = await getBrewery(breweryPath)
const brandPath = sake.data.brand?.path
const brand = await getBrand(brandPath)

const confirmDelete = ref(false)
async function deleteRecord() {
  await deleteItem(dataPath)
  await navigateTo(localePath("/" + sake?.data.brand?.path))
}
</script>

<template>
  <div>
    <h1>{{ $t("sake") }}</h1>
    <hr />
    <h2 v-if="sake">{{ sake?.data.name }}</h2>
    <dl>
      <dt>{{ $t("brewery") }}</dt>
      <dd>
        <NuxtLink :to="localePath('/' + sake?.data.brewery?.path)">
          <div class="w-full">{{ brewery.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("brand") }}</dt>
      <dd>
        <NuxtLink :to="localePath('/' + sake?.data.brand?.path)">
          <div class="w-full">{{ brand.data.name }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("type") }}</dt>
      <dd>
        <UBadge v-for="type in sake?.data.type" :key="type">{{ type }}</UBadge>
      </dd>
      <dt>{{ $t("pairing") }}</dt>
      <dd>
        <UBadge v-for="mariage in sake?.data.mariages" :key="mariage">{{ mariage }}</UBadge>
      </dd>
      <dt>{{ $t("explanation") }}</dt>
      <dd>{{ sake?.data.description }}</dd>
      <dt>{{ $t("url") }}</dt>
      <dd>
        <a v-if="sake.data.url" :href="sake.data.url">{{ sake.data.url }}</a>
      </dd>
      <dt>{{ $t("updatedAt") }}</dt>
      <dd>{{ sake.data.updatedAt }}</dd>
    </dl>
    <UButton class="info" :to="localePath(route.path + '/update')">{{ $t("edit") }}</UButton>
    <UButton class="danger" @click="confirmDelete = true">{{ $t("delete") }}</UButton>
    <UModal v-model="confirmDelete">
      <UCard>
        <Alert>{{ $t("confirmDelete") }}</Alert>
        <template #footer>
          <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
          <UButton class="danger" @click="deleteRecord">{{ $t("yes") }}</UButton>
        </template>
      </UCard>
    </UModal>
    <UButton :to="localePath('/' + brand?.path)">{{ $t("back") }}</UButton>
    <hr />
    <div class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("latestBreweryData") }}</h3>
      </div>
      <LastBreweryYearSpec :sake="sake" class="m-3" />
      <hr />
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("otherData") }}</h3>
        <div class="d-flex justify-content-between">
          <div />
          <UButton class="info" :to="localePath(route.path + '/breweryYearSpecs/add')">{{
            $t("addBreweryData")
          }}</UButton>
        </div>
      </div>
      <!-- <brewery-year-data-list class="m-3" /> -->
      <BreweryYearSpecList :sake="sake" />
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
              sakeId: route.params.sakeId,
            },
          })
        "
      >
        {{ $t("add") }}
      </UButton>
      <CommentList
        :brewery-id="String(route.params.breweryId)"
        :brand-id="String(route.params.brandId)"
        :sake-id="String(route.params.sakeId)"
      />
    </div>
  </div>
</template>
