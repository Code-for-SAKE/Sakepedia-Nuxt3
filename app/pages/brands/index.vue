<script setup lang="ts">
const route = useRoute()
const { getList } = useBrand()
const { t } = useI18n()
const localePath = useLocalePath()

const searchText = ref(route.query.name != null ? String(route.query.name) : "")
const limit = route.query.limit != null ? Number(route.query.limit) : 3
console.log("searchText", searchText.value)
console.log("limit", limit)

const res = await getList({
  searchText: searchText.value,
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
    label: t("name"),
    sortable: true,
  },
]

async function searchVector() {
  const res = await getList({
    searchText: searchText.value,
    before: undefined,
    limit: limit,
  })
  brands.value = res.list
  count.value = res.listCount
}
function setHistories() {
  const url = window.location.href.replace(/\?.*$/, "")
  const queries = `?name=${searchText.value}&limit=${limit}`
  window.history.pushState(null, "", `${url}${queries}`)
}
const getMoreData = async () => {
  const res = await getList({
    searchText: searchText.value,
    before: brands.value[brands.value.length - 1].data.name,
    limit: limit,
  })

  brands.value.splice(brands.value.length, 0, ...res.list)
}

useHead({
  title: t("brandList"),
})
</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1>{{ $t("brandList") }}</h1>
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
            <UButton @click="setHistories(), searchVector()">{{ $t("search") }}</UButton>
          </template>
        </UInput>
      </div>
    </div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}
    </div>
    <UTable :rows="brands" :columns="columns">
      <template #name-data="{ row }">
        <NuxtLink :to="localePath('/' + row.path)">
          <div class="w-full">{{ row.data.name }}</div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">{{ $t("more") }}</UButton>
  </div>
</template>
