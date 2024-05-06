<script setup lang="ts">
const tabItems = [{
  key: 'breweries-map',
  label: '都道府県別の酒蔵',
  content: 'breweries-map'
}, {
  key: 'breweries-map-hotsprings',
  label: '温泉近くの酒蔵',
  content: 'breweries-map-hotsprings'
}, {
  key: 'breweries-map-nature',
  label: '自然の中の酒蔵',
  content: 'Comming Soon...'
}]
</script>

<template>
  <div>
    <!-- <h1 class="text-3xl font-bold underline">Sakepedia Nuxt版</h1> -->
    <UCard>
      <template #header>
        酒蔵マップ
      </template>

      <UTabs :items="tabItems" orientation="vertical" :ui="{ wrapper: 'flex gap-4' }">
        <template #item="{ item }">
          <div v-if="item.key === 'breweries-map'" class="space-y-3">
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
      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>
    <h2>登録状況</h2>
    <div class="grid grid-cols-3 gap-4">
      <UCard>
        <template #header>
          酒蔵数
        </template>
        summary.brewery
      </UCard>
      <UCard>
        <template #header>
          銘柄数
        </template>
        summary.brand
      </UCard>
      <UCard>
        <template #header>
          日本酒数
        </template>
        summary.sake
      </UCard>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header>
          ユーザー数
        </template>
        summary.user
      </UCard>
      <UCard>
        <template #header>
          投稿数
        </template>
        summary.comment
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
