<script setup lang="ts">
import type { BreweryYearSpec } from "~/composables/useBreweryYearSpec"
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem: getSake } = useSake()
const { getItem, deleteItem } = useBreweryYearSpec()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const item = await getItem(dataPath)
const breweryYearSpec: Data<BreweryYearSpec> = item!
const confirmDelete = ref(false)
async function deleteRecord() {
  await deleteItem(dataPath)
  await navigateTo(localePath("/" + breweryYearSpec?.data.sake?.path))
}

const sakeItem = await getSake(breweryYearSpec?.data.sake?.path)
</script>

<template>
  <div>
    <h1>{{ $t("breweryData") }}</h1>
    <hr />
    <h2>
      <NuxtLink :to="localePath('/' + breweryYearSpec?.data.sake?.path)">
        <div class="w-full">{{ sakeItem.data.name }}</div>
      </NuxtLink>
    </h2>

    <h4 v-if="breweryYearSpec">{{ breweryYearSpec?.data.makedBY }}</h4>
    <dl>
      <dt>アミノ酸度</dt>
      <dd><RangeValue :values="breweryYearSpec.data.aminoAcidContent" /></dd>
      <dt>アルコール度</dt>
      <dd><RangeValue :values="breweryYearSpec.data.alcoholContent" /></dd>
      <dt>日本酒度</dt>
      <dd><RangeValue :values="breweryYearSpec.data.sakeMeterValue" /></dd>
      <dt>酸度</dt>
      <dd><RangeValue :values="breweryYearSpec.data.acidity" /></dd>
      <dt>精米歩合</dt>
      <dd><RangeValue :values="breweryYearSpec.data.ricePolishingRate" /></dd>
      <dt>酵母</dt>
      <dd>{{ breweryYearSpec.data.sakeYeast }}</dd>
      <dt>麹米</dt>
      <dd>{{ breweryYearSpec.data.riceForMakingKoji }}</dd>
      <dt>掛米</dt>
      <dd>{{ breweryYearSpec.data.sakeRiceExceptForKojiMaking }}</dd>
      <dt>製造年月(日)</dt>
      <dd>{{ breweryYearSpec.data.bottledDate }}</dd>
    </dl>

    <hr />
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
    <UButton :to="localePath('/' + breweryYearSpec.path)"> {{ $t("back") }}</UButton>
  </div>
</template>
