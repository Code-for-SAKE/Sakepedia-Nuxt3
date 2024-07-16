<script setup lang="ts">
import { useBrewery } from "~/composables/useBrewery"

interface Props {
  breweryId: string
}
const props = defineProps<Props>()

const { getBrandList } = useBrewery()
// const res =  getBrandList('60638e8e8d83689315fb5d7d');
const limit = 5

const res = await getBrandList({
  breweryId: props.breweryId,
  searchText: "",
  before: undefined,
  limit: limit,
})

const brands: Ref = ref(res.list)
const cnt = computed(() => brands.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "name",
    label: "",
    sortable: false,
  },
]

const getMoreData = async () => {
  const res = await getBrandList({
    breweryId: props.breweryId,
    before: brands.value[brands.value.length - 1].name,
    limit: limit,
  })

  brands.value.splice(brands.value.length, 0, ...res.list)
  count.value = res.listCount
}
</script>

<template>
  <div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}件
    </div>
    <UTable :rows="brands" :columns="columns" class="border border-t-0" :ui="{ thead: 'hidden' }">
      <template #name-data="{ row }">
        <NuxtLink :to="`/breweries/${props.breweryId}/brands/${row.id}`">
          <div class="w-full">
            <span>{{ row.name }}</span>
          </div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
  </div>
</template>
