<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
const { t } = useI18n()
const tabItems = [
  {
    key: "breweries-map",
    label: t("localBreweryMap"),
    content: "breweries-map",
  },
  {
    key: "breweries-map-hotsprings",
    label: t("onsenBreweryMap"),
    content: "breweries-map-hotsprings",
  },
  {
    key: "breweries-map-nature",
    label: t("natureBreweryMap"),
    content: "breweries-map-nature",
  },
]
const { getSummary } = useFirestore()

const summary = await getSummary()

const { width } = useWindowSize()

const tabOrientation = computed(() => {
  if (width.value > 840) {
    return "vertical"
  } else if (width.value > 640) {
    return "horizontal"
  } else {
    return "vertical"
  }
})
const mapPosition = computed(() => {
  if (width.value > 840) {
    return "flex"
  } else {
    return ""
  }
})

useHead({
  title: t("titleOfSite"),
})
</script>

<template>
  <div>
    <!-- <h1 class="text-3xl font-bold underline">Sakepedia Nuxt版</h1> -->
    <UCard
      :ui="{
        base: '',
        background: 'bg-gray-100 dark:bg-gray-900',
        divide: 'divide-y divide-gray-200 dark:divide-gray-800',
        ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
        rounded: 'rounded-lg',
        shadow: 'shadow',
        body: {
          base: '',
          background: '',
          padding: 'px-4 py-5 sm:p-6',
        },
        header: {
          base: 'text-gray-50',
          background: 'bg-sakeprimary-500',
          padding: 'px-2 py-2 sm:px-6',
        },
        footer: {
          base: '',
          background: '',
          padding: 'px-4 py-4 sm:px-6',
        },
      }"
    >
      <template #header> {{ $t("breweryMap") }} </template>
      <UTabs
        :items="tabItems"
        :orientation="tabOrientation"
        :ui="{ wrapper: mapPosition + ' gap-4' }"
      >
        <template #item="{ item }">
          <div v-if="item.key === 'breweries-map'" class="primary">
            <div class="map-wrap">
              <BreweriesMap />
            </div>
          </div>
          <div v-else-if="item.key === 'breweries-map-hotsprings'" class="space-y-3">
            <div class="map-wrap">Comming soon...</div>
          </div>
          <div v-else-if="item.key === 'breweries-map-nature'" class="space-y-3">
            <div class="map-wrap">Comming soon...</div>
          </div>
        </template>
      </UTabs>
    </UCard>
    <h2>{{ $t("summary") }}</h2>
    <div class="grid grid-cols-3 gap-4">
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> {{ $t("numberOfBreweries") }}</template>
        <p id="summary-brewery" class="summary text-center">
          {{ summary.brewery }}
        </p>
      </UCard>
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> {{ $t("numberOfBrands") }} </template>
        <p id="summary-brand" class="summary text-center">
          {{ summary.brand }}
        </p>
      </UCard>
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> {{ $t("numberOfSakes") }} </template>
        <p id="summary-sake" class="summary text-center">
          {{ summary.sake }}
        </p>
      </UCard>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> {{ $t("numberOfBreweryYearSpecs") }} </template>
        <p id="summary-brewery-year-spec" class="summary text-center">
          {{ summary.breweryYearSpec }}
        </p>
      </UCard>
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> {{ $t("numberOfPosts") }} </template>
        <p id="summary-post" class="summary text-center">
          {{ summary.post }}
        </p>
      </UCard>
    </div>
  </div>
</template>

<style>
.map-wrap {
  height: 45vh;
  width: 100%;
  text-align: center;
}

.map-tab {
  min-height: 4.5rem;
}

.summary {
  font-size: 2rem;
}
</style>
