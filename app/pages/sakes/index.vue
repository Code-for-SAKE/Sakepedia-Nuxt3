<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { getList } = useSake()
const localePath = useLocalePath()

const searchText = ref(route.query.name != null ? String(route.query.name) : "")
const limit = route.query.limit != null ? Number(route.query.limit) : 10
console.log("searchText", searchText.value)
console.log("limit", limit)

const res = await getList({
  searchText: searchText.value,
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
  sakes.value = res.list
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
    before: sakes.value[sakes.value.length - 1].data.name,
    limit: limit,
  })

  sakes.value.splice(sakes.value.length, 0, ...res.list)
  count.value = res.listCount
}

useHead({
    title: t('sakeList'),
})

</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1>{{ $t("sakeList") }}</h1>
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
      {{ cnt }} / {{ count }}{{ $t("item") }}
    </div>
    <UTable :rows="sakes" :columns="columns">
      <template #name-data="{ row }">
        <NuxtLink :to="localePath('/' + row.path)">
          <div class="w-full">{{ row.data.name }}</div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
  </div>
</template>
