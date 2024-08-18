<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { getList } = useBrewery()
const localePath = useLocalePath()

const searchText = ref(route.query.name != null ? String(route.query.name) : "")
const prefectureId: string = route.query.prefecture != null ? String(route.query.prefecture) : "0"
const prefecture = ref(
  prefectureId ? prefectures.find((e) => e.id === prefectureId) : prefectures[0],
)
const limit = route.query.limit ? Number(route.query.limit) : 2

const res = await getList({
  searchText: searchText.value,
  prefecture: prefectureId,
  before: undefined,
  limit: limit,
})

const breweries: Ref<Data<Brewery>[]> = ref(res.list)
const cnt = computed(() => breweries.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "name",
    label: t("name"),
    sortable: false,
  },
]

async function searchVector() {
  const res = await getList({
    searchText: searchText.value,
    prefecture: prefecture.value?.id ?? "0",
    before: undefined,
    limit: limit,
  })
  breweries.value = res.list
  count.value = res.listCount
}
function setHistories() {
  const url = window.location.href.replace(/\?.*$/, "")
  console.log("prefecture", prefecture)
  console.log("prefecture id", prefecture.value?.id ?? 0)
  const queries = `?name=${searchText.value}&prefecture=${prefecture.value?.id ?? 0}&limit=${limit}`
  window.history.pushState(null, "", `${url}${queries}`)
}
const getMoreData = async () => {
  const res = await getList({
    searchText: searchText.value,
    prefecture: prefecture.value?.id ?? "0",
    before: breweries.value[breweries.value.length - 1].data.name,
    limit: limit,
  })

  breweries.value.splice(breweries.value.length, 0, ...res.list)
  count.value = res.listCount
}
</script>

<template>
  <div>
    <div class="mb-4">
      <h1>{{ $t("breweryList") }}</h1>
      <UButton class="success" :to="localePath('/breweries/add')">{{ $t("add") }}</UButton>
    </div>
    <hr class="mb-4" />
    <div class="flex flex-wrap gap-4">
      <div class="flex flex-wrap items-stretch w-fit mb-4 relative">
        <div class="flex">
          <span
            class="flex items-center bg-gray-200 rounded rounded-r-none border border-r-0 px-3 text-sm"
            >{{ $t("prefecture") }}</span
          >
        </div>
        <UInputMenu
          id="prefecture"
          v-model="prefecture"
          :options="prefectures"
          by="id"
          option-attribute="nameJa"
          class="rounded-l-none"
        />
      </div>
      <div class="flex-auto">
        <UInput
          v-model="searchText"
          name="q"
          placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid"
          class="w-full"
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
    <UTable
      :rows="breweries"
      :columns="columns"
      class="border border-t-0"
      :ui="{ thead: 'hidden' }"
    >
      <template #name-data="{ row }">
        <NuxtLink :to="localePath('/breweries/' + row.id)">
          <div class="w-full">
            <span>{{ row.data.name }}</span>
            <span>{{
              row.data.prefecture
                ? prefectures.find((e) => e.id == row.data.prefecture)?.nameJa
                : ""
            }}</span>
          </div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">{{ $t("more") }}</UButton>
  </div>
</template>
