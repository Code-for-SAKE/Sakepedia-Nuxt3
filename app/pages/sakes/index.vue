<script setup lang="ts">
const route = useRoute()
const { getList } = useSake()

const searchText: string = route.query.name != null ? String(route.query.name) : ""
const limit = route.query.limit != null ? Number(route.query.limit) : 3
console.log("searchText", searchText)
console.log("limit", limit)

const res = await getList({
  searchText: searchText,
  before: undefined,
  limit: limit,
})

console.log("sakeres", res)
const sakes: Ref = ref(res.list)
const cnt = computed(() => sakes.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "name",
    label: $t("name"),
    sortable: true,
  },
]

const getMoreData = async () => {
  const res = await getList({
    searchText: searchText,
    before: sakes.value[sakes.value.length - 1].data.name,
    limit: limit,
  })

  sakes.value.splice(sakes.value.length, 0, ...res.list)
  count.value = res.listCount
}
</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1>{{ $t("breweryList") }}</h1>
      <UButton
        class="bg-success-500 text-black"
        variant="solid"
        to="/breweries/[breweryId]/brands/add.vue"
        >{{ $t("add") }}</UButton
      >
    </div>
    <hr >
    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <UInput
          v-model="searchText"
          name="q"
          placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <!-- <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
            @click="searchText = ''" /> -->
          </template>
        </UInput>
      </div>
    </div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}{{ $t("item") }}
    </div>
    <UTable :rows="sakes" :columns="columns">
      <template #name-data="{ row }">
        <NuxtLink :to="row.path">
          <div class="w-full">{{ row.data.name }}</div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
  </div>
</template>
