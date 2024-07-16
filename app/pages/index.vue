<script setup lang="ts">
const tabItems = [
  {
    key: "breweries-map",
    label: "都道府県別の酒蔵",
    content: "breweries-map",
  },
  {
    key: "breweries-map-hotsprings",
    label: "温泉近くの酒蔵",
    content: "breweries-map-hotsprings",
  },
  {
    key: "breweries-map-nature",
    label: "自然の中の酒蔵",
    content: "Comming Soon...",
  },
]
const { getSummary } = useFirestore()

const summary = await getSummary()
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
          background: 'bg-primary-600',
          padding: 'px-2 py-2 sm:px-6',
        },
        footer: {
          base: '',
          background: '',
          padding: 'px-4 py-4 sm:px-6',
        },
      }"
    >
      <template #header> 酒蔵マップ </template>

      <UTabs :items="tabItems" orientation="vertical" :ui="{ wrapper: 'flex gap-4' }">
        <template #item="{ item }">
          <div v-if="item.key === 'breweries-map'" class="primary">
            <div class="map-wrap">
              <BreweriesMap />
            </div>
          </div>
          <div v-else-if="item.key === 'breweries-map-hotsprings'" class="space-y-3">
            <div class="map-wrap">
              <BreweriesMap />
            </div>
          </div>
        </template>
      </UTabs>
    </UCard>
    <h2>登録状況</h2>
    <div class="grid grid-cols-3 gap-4">
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> 酒蔵数 </template>
        <p id="summary-brewery" class="summary text-center">
          {{ summary.brewery }}
        </p>
      </UCard>
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> 銘柄数 </template>
        <p id="summary-brand" class="summary text-center">
          {{ summary.brand }}
        </p>
      </UCard>
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> 日本酒数 </template>
        <p id="summary-sake" class="summary text-center">
          {{ summary.sake }}
        </p>
      </UCard>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> ユーザー数 </template>
        <p id="summary-user" class="summary text-center">
          {{ summary.user }}
        </p>
      </UCard>
      <UCard :ui="{ header: { background: 'bg-gray-100', padding: 'px-4 py-2 sm:px-2' } }">
        <template #header> 投稿数 </template>
        <p id="summary-comment" class="summary text-center">
          {{ summary.comment }}
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
