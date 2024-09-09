<script setup lang="ts">
import { useBreweryYearSpec } from "~/composables/useBreweryYearSpec"

interface Props {
  sake: Data<Sake>
}
const props = defineProps<Props>()

// const { getBreweryYearSpecList } = useSake()
const { getList } = useBreweryYearSpec()
const localePath = useLocalePath()

// const res =  getBrandList('60638e8e8d83689315fb5d7d');
const limit = 5

const res = await getList({
  sake: props.sake,
  searchText: "",
  before: undefined,
  limit: limit,
})

const breweryYearSpecs: Ref = ref(res.list)
const cnt = computed(() => breweryYearSpecs.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "name",
    label: "",
    sortable: false,
  },
]

const getMoreData = async () => {
  const res = await getList({
    sake: props.sake,
    before: breweryYearSpecs.value[breweryYearSpecs.value.length - 1].data.name,
    limit: limit,
    searchText: "",
  })

  breweryYearSpecs.value.splice(breweryYearSpecs.value.length, 0, ...res.list)
  count.value = res.listCount
}
</script>

<template>
  <div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}{{ $t("item") }}
    </div>
    <UTable
      :rows="breweryYearSpecs"
      :columns="columns"
      class="border border-t-0"
      :ui="{ thead: 'hidden' }"
    >
      <template #name-data="{ row }">
        <NuxtLink :to="localePath(`/${row.path}`)">
          <div class="w-full">
            <span>{{ row.data.makedBY }}</span>
          </div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
  </div>
</template>
