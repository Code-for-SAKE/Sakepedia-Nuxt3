<script setup lang="ts">
const route = useRoute()
const { getList } = useBrand()

const searchText: string = route.query.name != null ? String(route.query.name) : ""
const limit = route.query.limit != null ? Number(route.query.limit) : 3
console.log("searchText", searchText)
console.log("limit", limit)

const res = await getList({
  searchText: searchText,
  before: undefined,
  limit: limit,
})

console.log(res)
const brands: Ref = ref(res.list)
const cnt = computed(() => brands.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "name",
    label: "名前",
    sortable: true,
  },
]

const getMoreData = async () => {
  const res = await getList({
    searchText: searchText,
    before: brands.value[brands.value.length - 1].name,
    limit: limit,
  })

  brands.value.splice(brands.value.length, 0, ...res.list)
}
</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1>銘柄一覧</h1>
      <UButton class="success" to="/brands/add">追加</UButton>
    </div>
    <hr />
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
      {{ cnt }} / {{ count }}件
    </div>
    <UTable :rows="brands" :columns="columns">
      <template #name-data="{ row }">
        <NuxtLink :to="row.path">
          <div class="w-full">{{ row.name }}</div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
  </div>
</template>
