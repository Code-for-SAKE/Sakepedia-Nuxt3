<script setup lang="ts">
interface Props {
  breweryId: string
  brandId?: string
  sakeId?: string
}
const props = defineProps<Props>()

const { getList } = usePost()
const localePath = useLocalePath()

const limit = 5

const res = await getList({
  breweryId: props.breweryId,
  brandId: props.brandId,
  sakeId: props.sakeId,
  searchText: "",
  before: undefined,
  limit: limit,
})

const posts: Ref<Data<Post>[]> = ref(res.list)
const cnt = computed(() => posts.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "comment",
    label: "",
    sortable: false,
  },
]

const getMoreData = async () => {
  const res = await getList({
    breweryId: props.breweryId,
    brandId: props.brandId,
    sakeId: props.sakeId,
    searchText: "",
    before: posts.value[posts.value.length - 1].data.comment,
    limit: limit,
  })

  posts.value.splice(posts.value.length, 0, ...res.list)
  count.value = res.listCount
}
console.log(posts.value)
</script>

<template>
  <div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}{{ $t("item") }}
    </div>
    <UTable :rows="posts" :columns="columns" class="border border-t-0" :ui="{ thead: 'hidden' }">
      <template #comment-data="{ row }">
        <NuxtLink :to="localePath(`/posts/${row.id}`)">
          <div class="w-full">
            <span>{{ row.data.comment }}</span>
          </div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
  </div>
</template>
