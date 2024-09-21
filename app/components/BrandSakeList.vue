<script setup lang="ts">
interface Props {
  brandPath: string
}
const props = defineProps<Props>()

const { getSakeList } = useBrand()
const localePath = useLocalePath()

const limit = 5

const res = await getSakeList({
  brandPath: props.brandPath,
  searchText: "",
  before: undefined,
  limit: limit,
})

const sakes: Ref = ref(res.list)
const cnt = computed(() => sakes.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "name",
    label: "",
    sortable: false,
  },
]

const getMoreData = async () => {
  const res = await getSakeList({
    brandPath: props.brandPath,
    before: sakes.value[sakes.value.length - 1].data.name,
    limit: limit,
    searchText: "",
  })

  sakes.value.splice(sakes.value.length, 0, ...res.list)
  count.value = res.listCount
}
</script>

<template>
  <div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}{{ $t("item") }}
    </div>
    <UTable :rows="sakes" :columns="columns" class="border border-t-0" :ui="{ thead: 'hidden' }">
      <template #name-data="{ row }">
        <NuxtLink :to="localePath(`/${props.brandPath}/sakes/${row.id}`)">
          <div class="w-full">
            <span>{{ row.data.name }}</span>
          </div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
  </div>
</template>
