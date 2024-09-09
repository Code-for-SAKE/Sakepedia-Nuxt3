<script setup lang="ts">
import LastBreweryYearSpec from "~/components/LastBreweryYearSpec.vue"
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem, deleteItem } = useSake()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const item = await getItem(dataPath)
const sake: Data<Sake> = item!

const confirmDelete = ref(false)
const deleteSake = async function () {
  deleteItem(item.path)
}
</script>

<template>
  <div>
    <h1>{{ $t("sakeDetails") }}</h1>
    <hr />
    <h2 v-if="sake">{{ sake?.data.name }}</h2>
    <dl>
      <dt>{{ $t("brewery") }}</dt>
      <dd>
        <NuxtLink :to="localePath('/' + sake?.data.brewery?.path)">
          <div class="w-full">{{ sake?.data.brewery?.id }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("brand") }}</dt>
      <dd>
        <NuxtLink :to="localePath('/' + sake?.data.brand?.path)">
          <div class="w-full">{{ sake?.data.brand?.id }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("type") }}</dt>
      <dd />
      <dt>{{ $t("pairing") }}</dt>
      <dd />
      <dt>{{ $t("explanation") }}</dt>
      <dd>{{ sake?.data.description }}</dd>
      <dt>{{ $t("url") }}</dt>
      <dd />
      <dt>{{ $t("updatedAt") }}</dt>
      <dd />
    </dl>
    <UButton class="info" :to="localePath(route.path + '/update')">{{ $t("edit") }}</UButton>
    <UButton class="danger" @click="confirmDelete = true">{{ $t("delete") }}</UButton>
    <UModal v-model="confirmDelete">
      <UCard>
        <Alert>{{ $t("confirmDelete") }}</Alert>
        <template #footer>
          <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
          <UButton class="danger" @click="deleteSake">{{ $t("yes") }}</UButton>
        </template>
      </UCard>
    </UModal>
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
          <div></div>
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
        <div class="d-flex justify-content-between">
          <div></div>

          <UButton class="success" @click="confirmDelete = false">{{ $t("addPost") }}</UButton>
        </div>
      </div>
      <!-- <comment-list /> -->
    </div>
  </div>
</template>
